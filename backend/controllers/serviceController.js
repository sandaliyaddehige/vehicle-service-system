const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All services') query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const services = await Service.find(query).sort({ bookingCount: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (admin - includes inactive)
// @route   GET /api/services/admin
// @access  Private/Admin
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices, getAllServicesAdmin, createService, updateService, deleteService };
