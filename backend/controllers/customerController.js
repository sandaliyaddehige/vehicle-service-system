const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all customers (admin)
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let query = { role: 'customer' };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status === 'Active') query.isActive = true;
    if (status === 'Inactive') query.isActive = false;

    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Add booking count for each customer
    const customersWithBookings = await Promise.all(
      customers.map(async (c) => {
        const bookingCount = await Booking.countDocuments({ customerId: c._id });
        const lastBooking = await Booking.findOne({ customerId: c._id }).sort({ createdAt: -1 });
        return {
          ...c.toObject(),
          bookingCount,
          lastVisit: lastBooking ? lastBooking.date : null,
        };
      })
    );

    res.json({ customers: customersWithBookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private/Admin
const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const bookings = await Booking.find({ customerId: customer._id }).sort({ createdAt: -1 });
    res.json({ customer, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Admin
const updateCustomer = async (req, res) => {
  try {
    const { username, email, phone, address, isActive } = req.body;
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, address, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCustomers, getCustomerById, updateCustomer };
