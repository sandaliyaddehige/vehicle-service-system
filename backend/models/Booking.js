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
    let referenceNumber;
    let isUnique = false;

    // Retry loop to guarantee uniqueness
    while (!isUnique) {
      // Use last 4 digits of timestamp + 2 random digits to avoid collisions
      const timePart = Date.now().toString().slice(-4);
      const randomPart = Math.floor(Math.random() * 90 + 10); // 10–99
      referenceNumber = `FSB-${year}-${timePart}${randomPart}`;

      const existing = await mongoose.model('Booking').findOne({ referenceNumber });
      if (!existing) {
        isUnique = true;
      }
    }

    this.referenceNumber = referenceNumber;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
