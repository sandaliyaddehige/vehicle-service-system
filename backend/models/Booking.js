const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      unique: true,
    },
    // Customer info
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: { type: String },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Vehicle info
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      uppercase: true,
      trim: true,
    },
    vehicleMake: { type: String }, // e.g. Toyota
    vehicleModel: { type: String }, // e.g. Corolla
    // Service
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    // Scheduling
    date: {
      type: String,
      required: [true, 'Booking date is required'],
    },
    time: {
      type: String,
      required: [true, 'Booking time is required'],
    },
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    // Notes
    adminNote: { type: String },
    // Service progress
    currentStep: {
      type: String,
      enum: ['Booked', 'Approved', 'Servicing', 'QC Check', 'Ready'],
      default: 'Booked',
    },
    // Cost
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

// Auto-generate reference number before saving
bookingSchema.pre('save', async function (next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Booking').countDocuments();
    this.referenceNumber = `FSB-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
