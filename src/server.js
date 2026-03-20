const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');
const { initializeSocketServer } = require('./sockets');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);
    initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
