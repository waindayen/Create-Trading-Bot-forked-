const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: Number,
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  stopLoss: Number,
  takeProfit: Number,
  profit: Number,
  closedAt: Date,
  aiPrediction: {
    confidence: Number,
    predictedDirection: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);