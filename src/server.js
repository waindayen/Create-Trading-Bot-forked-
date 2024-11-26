const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const dashboardRoutes = require('./routes/dashboard');
const AIService = require('./services/AIService');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  logger.info('Client connected');
  
  socket.on('subscribe', (symbols) => {
    symbols.forEach(symbol => socket.join(symbol));
  });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Initialize services
const startServer = async () => {
  try {
    await connectDB();
    await AIService.initialize();
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();