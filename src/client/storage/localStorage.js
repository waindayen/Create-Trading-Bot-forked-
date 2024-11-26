export class LocalStorageService {
  static getPreferences() {
    try {
      const preferences = localStorage.getItem('tradingPreferences');
      return preferences ? JSON.parse(preferences) : {
        riskPerTrade: 0.02,
        stopLossPercent: 0.015,
        takeProfitPercent: 0.03,
        trailingStop: {
          enabled: false,
          distance: 0.01,
          dynamicAdjustment: true
        },
        autoReopen: {
          enabled: false,
          waitTime: 30,
          conditions: {
            rsi: true,
            priceAction: true,
            trend: true
          },
          positionSize: 'same',
          maxAttempts: 3
        }
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  static savePreferences(preferences) {
    try {
      localStorage.setItem('tradingPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  static getTrades() {
    try {
      const trades = localStorage.getItem('trades');
      return trades ? JSON.parse(trades) : [];
    } catch (error) {
      console.error('Error getting trades:', error);
      return [];
    }
  }

  static saveTrade(trade) {
    try {
      const trades = this.getTrades();
      const newTrade = {
        ...trade,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      trades.push(newTrade);
      localStorage.setItem('trades', JSON.stringify(trades));
      return newTrade;
    } catch (error) {
      console.error('Error saving trade:', error);
      return null;
    }
  }

  static updateTrade(tradeId, updates) {
    try {
      const trades = this.getTrades();
      const index = trades.findIndex(t => t.id === tradeId);
      if (index !== -1) {
        trades[index] = { ...trades[index], ...updates };
        localStorage.setItem('trades', JSON.stringify(trades));
        return trades[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating trade:', error);
      return null;
    }
  }

  static deleteTrade(tradeId) {
    try {
      const trades = this.getTrades();
      const filteredTrades = trades.filter(t => t.id !== tradeId);
      localStorage.setItem('trades', JSON.stringify(filteredTrades));
      return true;
    } catch (error) {
      console.error('Error deleting trade:', error);
      return false;
    }
  }
}