const app = require('./src/app');
const config = require('./src/config/config');
const connectDB = require('./src/config/db');

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
