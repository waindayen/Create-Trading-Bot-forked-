import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function NewTradeModal({ isOpen, onClose, onSubmit }) {
  const [tradeData, setTradeData] = useState({
    symbol: 'BTC/USDT',
    type: 'LONG',
    amount: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tradeData);
    onClose();
    setTradeData({
      symbol: 'BTC/USDT',
      type: 'LONG',
      amount: '',
      entryPrice: '',
      stopLoss: '',
      takeProfit: ''
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">New Trade</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.symbol}
                onChange={(e) => setTradeData({ ...tradeData, symbol: e.target.value })}
              >
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="BNB/USDT">BNB/USDT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.type}
                onChange={(e) => setTradeData({ ...tradeData, type: e.target.value })}
              >
                <option value="LONG">Long</option>
                <option value="SHORT">Short</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (USDT)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.amount}
                onChange={(e) => setTradeData({ ...tradeData, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Price</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.entryPrice}
                onChange={(e) => setTradeData({ ...tradeData, entryPrice: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stop Loss</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.stopLoss}
                onChange={(e) => setTradeData({ ...tradeData, stopLoss: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Take Profit</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={tradeData.takeProfit}
                onChange={(e) => setTradeData({ ...tradeData, takeProfit: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Create Trade
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default NewTradeModal;