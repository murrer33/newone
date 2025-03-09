import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Scale,
  Clock,
  Users
} from 'lucide-react';

interface StockStatsProps {
  stats: {
    marketCap: number;
    volume: number;
    avgVolume: number;
    peRatio: number;
    eps: number;
    dividend: number;
    high52w: number;
    low52w: number;
  };
}

const StockStats: React.FC<StockStatsProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  const statItems = [
    {
      label: 'Market Cap',
      value: formatNumber(stats.marketCap),
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      label: 'Volume',
      value: formatNumber(stats.volume),
      icon: <Activity className="h-5 w-5" />
    },
    {
      label: 'Avg Volume',
      value: formatNumber(stats.avgVolume),
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      label: 'P/E Ratio',
      value: stats.peRatio.toFixed(2),
      icon: <Scale className="h-5 w-5" />
    },
    {
      label: 'EPS',
      value: stats.eps.toFixed(2),
      icon: <Users className="h-5 w-5" />
    },
    {
      label: 'Dividend',
      value: stats.dividend.toFixed(2) + '%',
      icon: <Clock className="h-5 w-5" />
    },
    {
      label: '52W High',
      value: `$${stats.high52w.toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      label: '52W Low',
      value: `$${stats.low52w.toFixed(2)}`,
      icon: <TrendingDown className="h-5 w-5" />
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
              {stat.icon}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockStats;