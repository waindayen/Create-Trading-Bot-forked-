const ccxt = require('ccxt');

class ExchangeService {
  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      options: {
        defaultType: 'future'
      }
    });
  }

  async testConnection() {
    await this.exchange.loadMarkets();
    return true;
  }

  async getOHLCV(symbol, timeframe, limit) {
    const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
    return ohlcv.map(candle => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5]
    }));
  }
}

module.exports = { ExchangeService };