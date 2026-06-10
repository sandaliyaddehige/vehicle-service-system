const express = require('express');
const router = express.Router();
const {
  createBooking, getBookings, getBookingById,
  updateBookingStatus, deleteBooking, getDashboardStats,
} = require('../controllers/bookingController');
const { protect, adminOnly, optionalProtect } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.route('/')
  .get(protect, getBookings)
  .post(optionalProtect, createBooking); // Public but reads JWT if present

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, adminOnly, deleteBooking);

router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
