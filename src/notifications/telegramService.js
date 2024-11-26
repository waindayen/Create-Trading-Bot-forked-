const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(config.telegram.token, { polling: false });
    this.chatId = config.telegram.chatId;
  }

  async sendMessage(message) {
    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Error sending telegram message:', error);
    }
  }

  async sendTradeAlert(signal, price, rsi) {
    const message = `
🤖 <b>Trade Signal</b>
Signal: ${signal}
Price: ${price}
RSI: ${rsi}
Symbol: ${config.trading.symbol}
    `;
    await this.sendMessage(message);
  }
}