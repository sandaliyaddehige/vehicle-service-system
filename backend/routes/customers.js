const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById, updateCustomer } = require('../controllers/customerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getCustomers);
router.route('/:id')
  .get(protect, adminOnly, getCustomerById)
  .put(protect, adminOnly, updateCustomer);

module.exports = router;
