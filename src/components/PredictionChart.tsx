import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoricalData, StockPrediction } from '../types';
import { getPredictions } from '../services/predictionService';
import { AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PredictionChartProps {
  historicalData: HistoricalData[];
  predictions: StockPrediction[];
  setPredictions: Dispatch<SetStateAction<StockPrediction[]>>;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ 
  historicalData, 
  predictions,
  setPredictions 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setIsLoading(true);
        const result = await getPredictions(historicalData);
        setPredictions(result);
      } catch (err) {
        setError('Failed to load predictions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPredictions();
  }, [historicalData, setPredictions]);

  const chartData = {
    labels: [
      ...historicalData.map((item: HistoricalData) => item.date),
      ...predictions.map((item: StockPrediction) => item.timeframe)
    ],
    datasets: [
      {
        label: 'Historical Price',
        data: [...historicalData.map((item: HistoricalData) => item.close), ...Array(predictions.length).fill(null)],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        fill: true
      },
      {
        label: 'Predicted Price',
        data: [...Array(historicalData.length).fill(null), ...predictions.map((item: StockPrediction) => item.predictedPrice)],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 3,
        fill: false
      },
      {
        label: 'Confidence Interval',
        data: [...Array(historicalData.length).fill(null), ...predictions.map(item => item.predictedPrice * (1 + item.confidence / 100))],
        borderColor: 'rgba(234, 88, 12, 0.2)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1'
      },
      {
        label: 'Confidence Interval',
        data: [...Array(historicalData.length).fill(null), ...predictions.map(item => item.predictedPrice * (1 - item.confidence / 100))],
        borderColor: 'rgba(234, 88, 12, 0.2)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          filter: (item: any) => item.text !== 'Confidence Interval'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex - historicalData.length;
            if (context.dataset.label === 'Predicted Price' && dataIndex >= 0) {
              const prediction = predictions[dataIndex];
              return [
                `Predicted: $${context.raw.toFixed(2)}`,
                `Confidence: ${prediction.confidence.toFixed(1)}%`,
                `Range: $${(prediction.predictedPrice * (1 - prediction.confidence / 100)).toFixed(2)} - $${(prediction.predictedPrice * (1 + prediction.confidence / 100)).toFixed(2)}`
              ];
            }
            return `${context.dataset.label}: $${context.raw?.toFixed(2) || 'N/A'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading predictions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Price Predictions</h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((prediction, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {prediction.timeframe}
                </span>
                <span className={`text-sm font-medium ${
                  prediction.confidence > 80 ? 'text-green-500' :
                  prediction.confidence > 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {prediction.confidence.toFixed(1)}% confidence
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${prediction.predictedPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Range: ${(prediction.predictedPrice * (1 - prediction.confidence / 100)).toFixed(2)} - ${(prediction.predictedPrice * (1 + prediction.confidence / 100)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Predictions are generated using a statistical model trained on historical price data. The model considers trends, volatility, and market patterns to provide estimates with confidence intervals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;