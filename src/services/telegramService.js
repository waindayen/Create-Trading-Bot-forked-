const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger');

class TelegramService {
  constructor() {
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      this.chatId = process.env.TELEGRAM_CHAT_ID;
    } else {
      logger.warn('Telegram credentials not found. Notifications disabled.');
    }
  }

  async sendMessage(message) {
    if (!this.bot) return;
    
    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      logger.error('Telegram error:', error);
    }
  }

  async sendTradeAlert(signal, price, rsi) {
    const message = `
🤖 <b>Trade Signal</b>
Signal: ${signal}
Price: ${price}
RSI: ${rsi.toFixed(2)}
Symbol: BTC/USDT
    `;
    await this.sendMessage(message);
  }
}

module.exports = { TelegramService };