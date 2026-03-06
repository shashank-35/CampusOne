const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/campusone',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  // Email
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT, 10) || 587,
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || 'CampusOne <noreply@campusone.com>',
  // Client
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
