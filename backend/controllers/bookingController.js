const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public (customer)
const createBooking = async (req, res) => {
  try {
    const {
      customerName, phone, email, vehicleNumber, vehicleMake,
      vehicleModel, serviceType, serviceId, date, time,
    } = req.body;

    // Get service price if serviceId provided
    let totalAmount = 0;
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) totalAmount = service.price;
    }

    const booking = await Booking.create({
      customerName, phone, email,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleMake, vehicleModel, serviceType, serviceId,
      date, time, totalAmount,
      customerId: req.user ? req.user._id : undefined,
    });

    // Increment service booking count
    if (serviceId) {
      await Service.findByIdAndUpdate(serviceId, { $inc: { bookingCount: 1 } });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin) or user bookings (customer)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const { status, date, search, page = 1, limit = 10 } = req.query;
    let query = {};
    const conditions = [];

    // Customers only see their own bookings (by customerId or email)
    if (req.user.role === 'customer') {
      conditions.push({
        $or: [
          { customerId: req.user._id },
          { email: { $regex: new RegExp(`^${req.user.email}$`, 'i') } },
        ]
      });
    }

    if (status && status !== 'All') conditions.push({ status });
    if (date) conditions.push({ date });
    if (search) {
      conditions.push({
        $or: [
          { customerName: { $regex: search, $options: 'i' } },
          { vehicleNumber: { $regex: search, $options: 'i' } },
          { referenceNumber: { $regex: search, $options: 'i' } },
        ]
      });
    }

    if (conditions.length > 0) {
      query = { $and: conditions };
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('serviceId', 'name price duration icon');

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Customer can only view their own booking (by customerId or email)
    if (req.user.role === 'customer') {
      const isOwnerById = booking.customerId?.toString() === req.user._id.toString();
      const isOwnerByEmail = booking.email && booking.email.toLowerCase() === req.user.email.toLowerCase();
      if (!isOwnerById && !isOwnerByEmail) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote, currentStep } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status || booking.status;
    booking.adminNote = adminNote !== undefined ? adminNote : booking.adminNote;
    booking.currentStep = currentStep || booking.currentStep;

    // Auto-set currentStep based on status
    if (status === 'Approved') booking.currentStep = 'Approved';
    if (status === 'In Progress') booking.currentStep = 'Servicing';
    if (status === 'Completed') booking.currentStep = 'Ready';
    if (status === 'Rejected') booking.currentStep = 'Booked';

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [total, pending, approved, completed, rejected, inProgress, todayTotal] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Booking.countDocuments({ status: 'Approved' }),
        Booking.countDocuments({ status: 'Completed' }),
        Booking.countDocuments({ status: 'Rejected' }),
        Booking.countDocuments({ status: 'In Progress' }),
        Booking.countDocuments({ date: today }),
      ]);

    // Weekly bookings (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = await Booking.countDocuments({ date: dateStr });
      weeklyData.push({ date: dateStr, count, day: d.toLocaleDateString('en-US', { weekday: 'short' }) });
    }

    res.json({ total, pending, approved, completed, rejected, inProgress, todayTotal, weeklyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking, getBookings, getBookingById,
  updateBookingStatus, deleteBooking, getDashboardStats,
};
