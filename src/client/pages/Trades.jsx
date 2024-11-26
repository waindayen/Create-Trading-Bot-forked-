import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import NewTradeModal from '../components/NewTradeModal';
import { tradeService } from '../services/tradeService';
import { LocalStorageService } from '../storage/localStorage';

function Trades() {
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedTrades = LocalStorageService.getTrades();
    setTrades(storedTrades);
  }, []);

  const handleNewTrade = (tradeData) => {
    const newTrade = LocalStorageService.saveTrade(tradeData);
    if (newTrade) {
      setTrades(prev => [...prev, newTrade]);
    }
  };

  const handleCloseTrade = async (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    const updatedTrades = trades.map(t => 
      t.id === tradeId ? { ...t, status: 'CLOSED' } : t
    );
    setTrades(updatedTrades);
    LocalStorageService.updateTrade(tradeId, { status: 'CLOSED' });

    // Handle auto reopen if trade was closed due to stop loss
    if (trade.currentPrice <= trade.stopLoss) {
      const newTrade = await tradeService.handleStopLoss(trade);
      if (newTrade) {
        setTrades(prev => [...prev, newTrade]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Trades</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Trade
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PnL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap">{trade.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.type === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${trade.entryPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">${trade.currentPrice || trade.entryPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {trade.profit ? `${trade.profit > 0 ? '+' : ''}${trade.profit}%` : '0.00%'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {trade.status === 'OPEN' && (
                    <button
                      onClick={() => handleCloseTrade(trade.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewTradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewTrade}
      />
    </div>
  );
}

export default Trades;