const ccxt = require('ccxt');
const config = require('../config');

class ExchangeService {
  constructor(apiKeys) {
    this.exchange = new ccxt[config.exchange.name]({
      apiKey: apiKeys.apiKey,
      secret: apiKeys.apiSecret,
      options: {
        defaultType: 'future',
        adjustForTimeDifference: true
      }
    });
  }

  async getBalance() {
    return await this.exchange.fetchBalance();
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

  async createOrder(symbol, type, side, amount, price = undefined) {
    return await this.exchange.createOrder(symbol, type, side, amount, price);
  }

  calculatePosition(balance, price, riskAmount) {
    const positionSize = (balance * riskAmount) / price;
    return this.exchange.amountToPrecision(config.trading.symbol, positionSize);
  }
}