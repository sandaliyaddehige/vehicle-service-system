const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    }, // e.g. "45 min", "1.5 hr"
    icon: { type: String, default: '🔧' },
    category: {
      type: String,
      enum: ['Fluids', 'Brakes', 'AC', 'Tires', 'Electrical', 'General'],
      default: 'General',
    },
    badge: { type: String }, // e.g. "Most popular", "Seasonal deal"
    badgeColor: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    bookingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
