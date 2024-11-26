require('dotenv').config();

module.exports = {
  exchange: {
    name: 'binance',
    options: {
      defaultType: 'future',
      adjustForTimeDifference: true
    }
  },
  trading: {
    symbol: 'BTC/USDT',
    timeframe: '1h'
  },
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  }
};