const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const responseRoutes = require('./routes/responseRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// Parse incoming JSON payloads.
app.use(express.json());

// Basic API health endpoint.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Attractor API is running'
  });
});

// Register API resources.
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/responses', responseRoutes);

// Handle unmatched routes and application errors.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
