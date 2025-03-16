import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoricalData, ChartData, ChartOptions as CustomChartOptions } from '../types';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from '../utils/technicalIndicators';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IndicatorOption {
  enabled: boolean;
  period?: number;
  color?: string;
}

interface StockChartProps {
  data: HistoricalData[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [showIndicatorOptions, setShowIndicatorOptions] = useState(false);
  const [indicators, setIndicators] = useState({
    sma: { enabled: false, period: 20, color: 'rgb(255, 99, 132)' } as IndicatorOption,
    ema: { enabled: false, period: 20, color: 'rgb(255, 159, 64)' } as IndicatorOption,
    rsi: { enabled: false, period: 14, color: 'rgb(255, 99, 132)' } as IndicatorOption,
    macd: { enabled: false, color: 'rgb(75, 192, 192)' } as IndicatorOption,
    bollinger: { enabled: false, period: 20, stdDev: 2, color: 'rgba(75, 192, 192, 0.5)' } as IndicatorOption,
  });

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
        },
      },
    },
  };

  const getChartData = (): ChartData => {
    const labels = data.map((d: HistoricalData) => d.date);
    const prices = data.map((d: HistoricalData) => d.close);

    const datasets = [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ];

    if (indicators.sma.enabled) {
      const sma = calculateSMA(data, indicators.sma.period || 20);
      datasets.push({
        label: `SMA ${indicators.sma.period}`,
        data: sma,
        borderColor: indicators.sma.color,
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      });
    }

    if (indicators.ema.enabled) {
      const ema = calculateEMA(data, indicators.ema.period || 20);
      datasets.push({
        label: `EMA ${indicators.ema.period}`,
        data: ema,
        borderColor: indicators.ema.color,
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      });
    }

    if (indicators.bollinger.enabled) {
      const { upper, middle, lower } = calculateBollingerBands(
        data,
        indicators.bollinger.period || 20,
        indicators.bollinger.stdDev || 2
      );
      datasets.push(
        {
          label: 'BB Upper',
          data: upper,
          borderColor: indicators.bollinger.color,
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'BB Middle',
          data: middle,
          borderColor: 'rgba(75, 192, 192, 0.3)',
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'BB Lower',
          data: lower,
          borderColor: indicators.bollinger.color,
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 5,
        }
      );
    }

    return { labels, datasets };
  };

  const getRSIChartData = (): ChartData => {
    const labels = data.map((d: HistoricalData) => d.date);
    const rsi = calculateRSI(data, indicators.rsi.period || 14);

    return {
      labels,
      datasets: [
        {
          label: `RSI ${indicators.rsi.period}`,
          data: rsi,
          borderColor: indicators.rsi.color,
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const getMACDChartData = (): ChartData => {
    const labels = data.map((d: HistoricalData) => d.date);
    const { macd, signal, histogram } = calculateMACD(data);

    return {
      labels,
      datasets: [
        {
          label: 'MACD',
          data: macd,
          borderColor: indicators.macd.color,
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Signal',
          data: signal,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Histogram',
          data: histogram,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: { ...prev[indicator], enabled: !prev[indicator].enabled }
    }));
  };

  const updateIndicatorPeriod = (indicator: keyof typeof indicators, period: number) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: { ...prev[indicator], period }
    }));
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white"
            onClick={() => setShowIndicatorOptions(!showIndicatorOptions)}
          >
            Technical Indicators
          </button>
        </div>
        <div className="flex space-x-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 rounded ${
                timeframe === tf ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {showIndicatorOptions && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* SMA Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicators.sma.enabled}
                  onChange={() => toggleIndicator('sma')}
                  className="rounded"
                />
                <label className="font-medium">SMA</label>
              </div>
              {indicators.sma.enabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm">Period:</label>
                  <input
                    type="number"
                    value={indicators.sma.period}
                    onChange={(e) => updateIndicatorPeriod('sma', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min="1"
                    max="200"
                  />
                </div>
              )}
            </div>

            {/* EMA Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicators.ema.enabled}
                  onChange={() => toggleIndicator('ema')}
                  className="rounded"
                />
                <label className="font-medium">EMA</label>
              </div>
              {indicators.ema.enabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm">Period:</label>
                  <input
                    type="number"
                    value={indicators.ema.period}
                    onChange={(e) => updateIndicatorPeriod('ema', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min="1"
                    max="200"
                  />
                </div>
              )}
            </div>

            {/* RSI Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicators.rsi.enabled}
                  onChange={() => toggleIndicator('rsi')}
                  className="rounded"
                />
                <label className="font-medium">RSI</label>
              </div>
              {indicators.rsi.enabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm">Period:</label>
                  <input
                    type="number"
                    value={indicators.rsi.period}
                    onChange={(e) => updateIndicatorPeriod('rsi', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min="1"
                    max="100"
                  />
                </div>
              )}
            </div>

            {/* MACD Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicators.macd.enabled}
                  onChange={() => toggleIndicator('macd')}
                  className="rounded"
                />
                <label className="font-medium">MACD</label>
              </div>
            </div>

            {/* Bollinger Bands Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicators.bollinger.enabled}
                  onChange={() => toggleIndicator('bollinger')}
                  className="rounded"
                />
                <label className="font-medium">Bollinger Bands</label>
              </div>
              {indicators.bollinger.enabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm">Period:</label>
                  <input
                    type="number"
                    value={indicators.bollinger.period}
                    onChange={(e) => updateIndicatorPeriod('bollinger', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min="1"
                    max="200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-[400px]">
        <Line options={chartOptions} data={getChartData()} />
      </div>
      {indicators.rsi.enabled && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">RSI</h3>
          <div className="h-[200px]">
            <Line
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales?.y,
                    min: 0,
                    max: 100,
                  },
                },
              }}
              data={getRSIChartData()}
            />
          </div>
        </div>
      )}
      {indicators.macd.enabled && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">MACD</h3>
          <div className="h-[200px]">
            <Line options={chartOptions} data={getMACDChartData()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;