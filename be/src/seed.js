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
  },
  {
    firstName: 'Head',
    lastName: 'Center',
    email: 'head@campusone.com',
    password: 'head123',
    role: 'head',
    status: 'active',
  },
  {
    firstName: 'Test',
    lastName: 'Student',
    email: 'student@campusone.com',
    password: 'student123',
    role: 'student',
    status: 'active',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected for seeding');

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`${userData.role} user already exists (${userData.email})`);
      } else {
        await User.create(userData);
        console.log(`${userData.role} user created: ${userData.email} / ${userData.password}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
