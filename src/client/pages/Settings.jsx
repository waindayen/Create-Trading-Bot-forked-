import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import AutoReopenSettings from '../components/AutoReopenSettings';

function Settings() {
  const [settings, setSettings] = useState({
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
  });

  const updateNestedSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = () => {
    localStorage.setItem('tradingPreferences', JSON.stringify(settings));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Risk Management</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Per Trade (%)</label>
            <input
              type="number"
              value={settings.riskPerTrade * 100}
              onChange={(e) => updateNestedSetting('riskPerTrade', parseFloat(e.target.value) / 100)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
            <input
              type="number"
              value={settings.stopLossPercent * 100}
              onChange={(e) => updateNestedSetting('stopLossPercent', parseFloat(e.target.value) / 100)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Take Profit (%)</label>
            <input
              type="number"
              value={settings.takeProfitPercent * 100}
              onChange={(e) => updateNestedSetting('takeProfitPercent', parseFloat(e.target.value) / 100)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trailing Stop-Loss</h2>
          <Switch
            checked={settings.trailingStop.enabled}
            onChange={(value) => updateNestedSetting('trailingStop.enabled', value)}
            className={`${
              settings.trailingStop.enabled ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className={`${
              settings.trailingStop.enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
          </Switch>
        </div>

        {settings.trailingStop.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance (%)</label>
              <input
                type="number"
                value={settings.trailingStop.distance * 100}
                onChange={(e) => updateNestedSetting('trailingStop.distance', parseFloat(e.target.value) / 100)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                step="0.1"
                min="0.1"
                max="100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.trailingStop.dynamicAdjustment}
                onChange={(e) => updateNestedSetting('trailingStop.dynamicAdjustment', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Dynamic Distance Adjustment
              </label>
            </div>
          </div>
        )}
      </div>

      <AutoReopenSettings 
        settings={settings} 
        updateSettings={updateNestedSetting} 
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;