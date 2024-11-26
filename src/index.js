const { RSIStrategy } = require('./strategies/rsiStrategy');
const { ExchangeService } = require('./services/exchangeService');
const { TelegramService } = require('./services/telegramService');
const logger = require('./utils/logger');
require('dotenv').config();

class TradingBot {
  constructor() {
    this.exchange = new ExchangeService();
    this.strategy = new RSIStrategy();
    this.telegram = new TelegramService();
  }

  async start() {
    logger.info('Starting trading bot...');
    
    try {
      // Test exchange connection
      await this.exchange.testConnection();
      logger.info('Exchange connection successful');
      
      // Start main loop
      this.runMainLoop();
    } catch (error) {
      logger.error('Bot startup error:', error);
      process.exit(1);
    }
  }

  async runMainLoop() {
    while (true) {
      try {
        await this.analyze();
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
      } catch (error) {
        logger.error('Analysis error:', error);
        await this.telegram.sendMessage(`❌ Error: ${error.message}`);
      }
    }
  }

  async analyze() {
    const symbol = 'BTC/USDT';
    const timeframe = '1h';
    
    // Get market data
    const candles = await this.exchange.getOHLCV(symbol, timeframe, 100);
    const prices = candles.map(candle => candle.close);
    const currentPrice = prices[prices.length - 1];
    
    // Analyze using RSI
    const signal = this.strategy.analyze(prices);
    
    if (signal.signal !== 'NEUTRAL') {
      logger.info(`Signal detected: ${signal.signal} at price ${currentPrice}`);
      await this.telegram.sendTradeAlert(signal.signal, currentPrice, signal.value);
    }
  }
}

// Start the bot
const bot = new TradingBot();
bot.start().catch(error => {
  logger.error('Fatal error:', error);
  process.exit(1);
});