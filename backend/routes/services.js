const express = require('express');
const router = express.Router();
const {
  getServices, getAllServicesAdmin, createService, updateService, deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getServices); // Public
router.get('/admin', protect, adminOnly, getAllServicesAdmin);

router.post('/', protect, adminOnly, createService);
router.route('/:id')
  .put(protect, adminOnly, updateService)
  .delete(protect, adminOnly, deleteService);

module.exports = router;
