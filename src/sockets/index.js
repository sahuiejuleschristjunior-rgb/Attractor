const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (error) {
      return next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket) => {
    // Each authenticated user joins a private room to receive targeted events.
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    socket.emit('socket:ready', {
      connected: true,
      socketId: socket.id
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet');
  }

  return io;
};

module.exports = {
  initializeSocketServer,
  getIO
};
