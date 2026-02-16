const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  const conn = await mongoose.connect(config.mongoUri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
