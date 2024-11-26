const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  apiKeys: [{
    exchange: String,
    apiKey: String,
    apiSecret: String,
    permissions: [String]
  }],
  tradingPreferences: {
    riskPerTrade: {
      type: Number,
      default: 0.02
    },
    stopLossPercent: {
      type: Number,
      default: 0.015
    },
    takeProfitPercent: {
      type: Number,
      default: 0.03
    },
    trailingStopSettings: {
      enabled: Boolean,
      distance: Number,
      dynamicAdjustment: Boolean
    }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);