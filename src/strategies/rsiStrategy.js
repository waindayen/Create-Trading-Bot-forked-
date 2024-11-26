const { RSI } = require('technicalindicators');

class RSIStrategy {
  constructor(period = 14, overbought = 70, oversold = 30) {
    this.period = period;
    this.overbought = overbought;
    this.oversold = oversold;
  }

  analyze(prices) {
    const rsi = RSI.calculate({
      values: prices,
      period: this.period
    });

    const currentRSI = rsi[rsi.length - 1];

    if (currentRSI < this.oversold) {
      return { signal: 'BUY', value: currentRSI };
    } else if (currentRSI > this.overbought) {
      return { signal: 'SELL', value: currentRSI };
    }

    return { signal: 'NEUTRAL', value: currentRSI };
  }
}

module.exports = { RSIStrategy };