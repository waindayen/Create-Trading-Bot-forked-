import { LocalStorageService } from '../storage/localStorage.js';
import { RSI } from 'technicalindicators';

class TradeService {
  constructor() {
    this.trades = LocalStorageService.getTrades();
    this.settings = LocalStorageService.getPreferences();
  }

  async checkReopenConditions(trade) {
    const conditions = this.settings.autoReopen.conditions;
    let conditionsMet = 0;
    let requiredConditions = 0;

    if (conditions.rsi) {
      requiredConditions++;
      if (await this.checkRSICondition(trade)) {
        conditionsMet++;
      }
    }

    if (conditions.priceAction) {
      requiredConditions++;
      if (await this.checkPriceActionCondition(trade)) {
        conditionsMet++;
      }
    }

    if (conditions.trend) {
      requiredConditions++;
      if (await this.checkTrendCondition(trade)) {
        conditionsMet++;
      }
    }

    return conditionsMet === requiredConditions;
  }

  async calculateRSI(prices, period = 14) {
    const rsiInput = {
      values: prices,
      period: period
    };
    
    const rsiValues = RSI.calculate(rsiInput);
    return rsiValues[rsiValues.length - 1];
  }

  async checkRSICondition(trade) {
    const prices = await this.getHistoricalPrices(trade.symbol);
    const rsi = await this.calculateRSI(prices);
    return trade.type === 'LONG' ? rsi <= 30 : rsi >= 70;
  }

  async getHistoricalPrices(symbol, limit = 100) {
    // Simulated historical prices for demo
    const prices = [];
    let basePrice = 50000; // Example base price for BTC
    for (let i = 0; i < limit; i++) {
      basePrice = basePrice * (1 + (Math.random() - 0.5) * 0.02);
      prices.push(basePrice);
    }
    return prices;
  }

  async checkPriceActionCondition(trade) {
    const prices = await this.getHistoricalPrices(trade.symbol);
    const lastPrice = prices[prices.length - 1];
    const prevPrice = prices[prices.length - 2];
    
    if (trade.type === 'LONG') {
      return lastPrice > prevPrice;
    } else {
      return lastPrice < prevPrice;
    }
  }

  async checkTrendCondition(trade) {
    const prices = await this.getHistoricalPrices(trade.symbol);
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);
    
    if (trade.type === 'LONG') {
      return sma20 > sma50;
    } else {
      return sma20 < sma50;
    }
  }

  calculateSMA(prices, period) {
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  calculateNewPositionSize(originalSize) {
    const sizeStrategy = this.settings.autoReopen.positionSize;
    switch (sizeStrategy) {
      case 'half':
        return originalSize * 0.5;
      case 'double':
        return originalSize * 2;
      default:
        return originalSize;
    }
  }

  async handleStopLoss(trade) {
    if (!this.settings.autoReopen.enabled) return;

    const attempts = trade.reopenAttempts || 0;
    if (attempts >= this.settings.autoReopen.maxAttempts) return;

    // Wait for specified time
    await new Promise(resolve => setTimeout(resolve, this.settings.autoReopen.waitTime * 60 * 1000));

    // Check if conditions are met for reopening
    const shouldReopen = await this.checkReopenConditions(trade);
    
    if (shouldReopen) {
      const currentPrice = await this.getCurrentPrice(trade.symbol);
      const newPositionSize = this.calculateNewPositionSize(trade.amount);
      
      const newTrade = {
        ...trade,
        amount: newPositionSize,
        entryPrice: currentPrice,
        reopenAttempts: attempts + 1,
        status: 'OPEN',
        stopLoss: this.calculateStopLoss(trade.type, currentPrice),
        takeProfit: this.calculateTakeProfit(trade.type, currentPrice)
      };

      return LocalStorageService.saveTrade(newTrade);
    }
  }

  async getCurrentPrice(symbol) {
    const prices = await this.getHistoricalPrices(symbol, 1);
    return prices[0];
  }

  calculateStopLoss(type, currentPrice) {
    const stopLossPercent = this.settings.stopLossPercent;
    return type === 'LONG' 
      ? currentPrice * (1 - stopLossPercent) 
      : currentPrice * (1 + stopLossPercent);
  }

  calculateTakeProfit(type, currentPrice) {
    const takeProfitPercent = this.settings.takeProfitPercent;
    return type === 'LONG'
      ? currentPrice * (1 + takeProfitPercent)
      : currentPrice * (1 - takeProfitPercent);
  }
}

export const tradeService = new TradeService();