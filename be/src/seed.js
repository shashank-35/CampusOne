const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/User');

const seedUsers = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@campusone.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    mobileNumber: '9000000001',
  },
  {
    firstName: 'Alex',
    lastName: 'Counselor',
    email: 'counselor@campusone.com',
    password: 'counselor123',
    role: 'counselor',
    status: 'active',
    mobileNumber: '9000000002',
  },
  {
    firstName: 'Rita',
    lastName: 'Receptionist',
    email: 'receptionist@campusone.com',
    password: 'receptionist123',
    role: 'receptionist',
    status: 'active',
    mobileNumber: '9000000003',
  },
  {
    firstName: 'John',
    lastName: 'Student',
    email: 'student@campusone.com',
    password: 'student123',
    role: 'student',
    status: 'active',
    mobileNumber: '9000000004',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected for seeding');

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User already exists: ${userData.email}`);
      } else {
        // Only create admin if none exists
        if (userData.role === 'admin') {
          const adminExists = await User.findOne({ role: 'admin' });
          if (adminExists) {
            console.log('Admin already exists, skipping');
            continue;
          }
        }
        await User.create(userData);
        console.log(`Created ${userData.role}: ${userData.email} / ${userData.password}`);
      }
    }

    console.log('\nSeed complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
