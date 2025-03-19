import React from 'react';
import { DollarSign, TrendingUp, Activity, Scale, Users, Percent } from 'lucide-react';

interface KeyStatisticsProps {
  stats: {
    marketCap: number;
    enterpriseValue: number;
    trailingPE: number;
    forwardPE: number;
    pegRatio: number;
    priceToSales: number;
    priceToBook: number;
    enterpriseToRevenue: number;
    enterpriseToEbitda: number;
    beta: number;
    fiftyTwoWeekChange: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    fiftyDayAverage: number;
    twoHundredDayAverage: number;
    sharesOutstanding: number;
    sharesFloat: number;
    sharesShort: number;
    shortRatio: number;
    shortPercentOfFloat: number;
    averageVolume: number;
    volume: number;
    dividendRate: number;
    dividendYield: number;
    exDividendDate: string;
    payoutRatio: number;
  };
}

const KeyStatistics: React.FC<KeyStatisticsProps> = ({ stats }) => {
  const formatNumber = (num: number, type: 'currency' | 'percent' | 'number' = 'number') => {
    if (type === 'currency') {
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      return `$${num.toFixed(2)}`;
    } else if (type === 'percent') {
      return `${num.toFixed(2)}%`;
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const sections = [
    {
      title: 'Valuation Measures',
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      items: [
        { label: 'Market Cap', value: formatNumber(stats.marketCap, 'currency') },
        { label: 'Enterprise Value', value: formatNumber(stats.enterpriseValue, 'currency') },
        { label: 'Trailing P/E', value: formatNumber(stats.trailingPE) },
        { label: 'Forward P/E', value: formatNumber(stats.forwardPE) },
        { label: 'PEG Ratio', value: formatNumber(stats.pegRatio) },
        { label: 'Price/Sales', value: formatNumber(stats.priceToSales) },
        { label: 'Price/Book', value: formatNumber(stats.priceToBook) }
      ]
    },
    {
      title: 'Trading Information',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      items: [
        { label: 'Beta', value: formatNumber(stats.beta) },
        { label: '52-Week Change', value: formatNumber(stats.fiftyTwoWeekChange, 'percent') },
        { label: '52 Week High', value: formatNumber(stats.fiftyTwoWeekHigh, 'currency') },
        { label: '52 Week Low', value: formatNumber(stats.fiftyTwoWeekLow, 'currency') },
        { label: '50-Day Average', value: formatNumber(stats.fiftyDayAverage, 'currency') },
        { label: '200-Day Average', value: formatNumber(stats.twoHundredDayAverage, 'currency') }
      ]
    },
    {
      title: 'Share Statistics',
      icon: <Users className="h-5 w-5 text-purple-500" />,
      items: [
        { label: 'Shares Outstanding', value: formatNumber(stats.sharesOutstanding) },
        { label: 'Float', value: formatNumber(stats.sharesFloat) },
        { label: 'Shares Short', value: formatNumber(stats.sharesShort) },
        { label: 'Short Ratio', value: formatNumber(stats.shortRatio) },
        { label: 'Short % of Float', value: formatNumber(stats.shortPercentOfFloat, 'percent') }
      ]
    },
    {
      title: 'Dividends & Splits',
      icon: <Percent className="h-5 w-5 text-yellow-500" />,
      items: [
        { label: 'Dividend Rate', value: formatNumber(stats.dividendRate, 'currency') },
        { label: 'Dividend Yield', value: formatNumber(stats.dividendYield, 'percent') },
        { label: 'Ex-Dividend Date', value: new Date(stats.exDividendDate).toLocaleDateString() },
        { label: 'Payout Ratio', value: formatNumber(stats.payoutRatio, 'percent') }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Statistics</h2>
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center mb-4">
              {section.icon}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                {section.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyStatistics;