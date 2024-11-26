class LocalStorageService {
  static getPreferences() {
    const preferences = localStorage.getItem('tradingPreferences');
    return preferences ? JSON.parse(preferences) : {
      riskPerTrade: 0.02,
      stopLossPercent: 0.015,
      takeProfitPercent: 0.03,
      trailingStop: {
        enabled: false,
        distance: 0.01,
        dynamicAdjustment: true
      }
    };
  }

  static savePreferences(preferences) {
    localStorage.setItem('tradingPreferences', JSON.stringify(preferences));
  }

  static getApiKeys() {
    const keys = localStorage.getItem('apiKeys');
    return keys ? JSON.parse(keys) : {
      exchange: '',
      apiKey: '',
      apiSecret: ''
    };
  }

  static saveApiKeys(keys) {
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  }

  static getTrades() {
    const trades = localStorage.getItem('trades');
    return trades ? JSON.parse(trades) : [];
  }

  static saveTrade(trade) {
    const trades = this.getTrades();
    trades.push({
      ...trade,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trades', JSON.stringify(trades));
  }

  static updateTrade(tradeId, updates) {
    const trades = this.getTrades();
    const index = trades.findIndex(t => t.id === tradeId);
    if (index !== -1) {
      trades[index] = { ...trades[index], ...updates };
      localStorage.setItem('trades', JSON.stringify(trades));
    }
  }
}