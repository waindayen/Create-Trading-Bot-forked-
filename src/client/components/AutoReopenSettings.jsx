import React from 'react';
import { Switch } from '@headlessui/react';

function AutoReopenSettings({ settings, updateSettings }) {
  const handleChange = (path, value) => {
    updateSettings(path, value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Auto Reopen After Stop-Loss</h2>
        <Switch
          checked={settings.autoReopen.enabled}
          onChange={(value) => handleChange('autoReopen.enabled', value)}
          className={`${
            settings.autoReopen.enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className={`${
            settings.autoReopen.enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`} />
        </Switch>
      </div>

      {settings.autoReopen.enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Wait Time (minutes)</label>
            <input
              type="number"
              value={settings.autoReopen.waitTime}
              onChange={(e) => handleChange('autoReopen.waitTime', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Conditions for Reopening</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoReopen.conditions.rsi}
                  onChange={(e) => handleChange('autoReopen.conditions.rsi', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">RSI Oversold/Overbought</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoReopen.conditions.priceAction}
                  onChange={(e) => handleChange('autoReopen.conditions.priceAction', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Price Action Confirmation</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoReopen.conditions.trend}
                  onChange={(e) => handleChange('autoReopen.conditions.trend', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Trend Direction</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Position Size for Reopening</label>
            <select
              value={settings.autoReopen.positionSize}
              onChange={(e) => handleChange('autoReopen.positionSize', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="same">Same as Original</option>
              <option value="half">Half of Original</option>
              <option value="double">Double (Martingale)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Reopen Attempts</label>
            <input
              type="number"
              value={settings.autoReopen.maxAttempts}
              onChange={(e) => handleChange('autoReopen.maxAttempts', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoReopenSettings;