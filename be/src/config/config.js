const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/campusone',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
};
