import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import TradingViewWidget from '../components/TradingViewWidget';

function Dashboard() {
  const [portfolio, setPortfolio] = useState({
    total: 0,
    dailyChange: 0,
    trades: []
  });

  useEffect(() => {
    const mockData = {
      total: 25000,
      dailyChange: 3.5,
      trades: [
        { date: '2023-11-01', value: 24000 },
        { date: '2023-11-02', value: 24500 },
        { date: '2023-11-03', value: 25000 }
      ]
    };
    setPortfolio(mockData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Portfolio Value"
          value={`$${portfolio.total.toLocaleString()}`}
          icon={CurrencyDollarIcon}
        />
        <StatsCard
          title="24h Change"
          value={`${portfolio.dailyChange}%`}
          icon={portfolio.dailyChange >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
          type={portfolio.dailyChange >= 0 ? 'success' : 'danger'}
        />
        <StatsCard
          title="Active Trades"
          value="5"
          icon={ArrowTrendingUpIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolio.trades}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">BTC/USDT Chart</h2>
          <TradingViewWidget symbol="BTCUSDT" />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, type = 'default' }) {
  const colors = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colors[type]} p-3 rounded-full`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;