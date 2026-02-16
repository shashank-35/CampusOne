const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected for seeding');

    const existingAdmin = await User.findOne({ email: 'admin@campusone.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@campusone.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@campusone.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
