const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({ role: 'admin' });
    await Service.deleteMany();

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@fuchsius.lk',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created:', admin.email);

    // Create services
    const services = await Service.insertMany([
      {
        name: 'Oil Change',
        description: 'Engine oil & filter replacement with a complimentary multi-point vehicle check.',
        price: 3500,
        duration: '45 min',
        icon: '💧',
        category: 'Fluids',
        badge: 'Most popular',
        isFeatured: true,
        bookingCount: 48,
      },
      {
        name: 'Brake Service',
        description: 'Brake pads, discs & hydraulic system inspection by certified mechanics.',
        price: 7200,
        duration: '1.5 hr',
        icon: '✅',
        category: 'Brakes',
        badge: 'Certified',
        isFeatured: true,
        bookingCount: 34,
      },
      {
        name: 'AC Service',
        description: 'Refrigerant top-up, compressor check & filter replacement.',
        price: 5800,
        duration: '1 hr',
        icon: '❄️',
        category: 'AC',
        badge: 'Seasonal deal',
        isFeatured: true,
        bookingCount: 25,
      },
      {
        name: 'Tire Rotation',
        description: 'Rotate, balance & tyre pressure check for even wear.',
        price: 2200,
        duration: '30 min',
        icon: '🔄',
        category: 'Tires',
        bookingCount: 18,
      },
      {
        name: 'Battery Check',
        description: 'Battery health diagnostic and terminal cleaning.',
        price: 1500,
        duration: '20 min',
        icon: '⚡',
        category: 'Electrical',
        bookingCount: 12,
      },
      {
        name: 'Full Inspection',
        description: '50-point comprehensive vehicle health check by certified mechanics.',
        price: 4500,
        duration: '2 hr',
        icon: '📋',
        category: 'General',
        bookingCount: 20,
      },
    ]);

    console.log(`✅ ${services.length} services created`);
    console.log('\n🎉 Seed complete!');
    console.log('Admin login: admin@fuchsius.lk / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
