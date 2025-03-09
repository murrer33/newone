import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SocialMediaSentiment } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SentimentChartProps {
  data: SocialMediaSentiment[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const platformLabels = data.map(item => {
    // Capitalize first letter
    const platform = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
    return platform;
  });

  const chartData = {
    labels: platformLabels,
    datasets: [
      {
        label: 'Sentiment Score',
        data: data.map(item => item.score),
        backgroundColor: data.map(item => {
          if (item.sentiment === 'positive') return 'rgba(34, 197, 94, 0.7)';
          if (item.sentiment === 'negative') return 'rgba(239, 68, 68, 0.7)';
          return 'rgba(234, 179, 8, 0.7)';
        }),
        borderColor: data.map(item => {
          if (item.sentiment === 'positive') return 'rgb(34, 197, 94)';
          if (item.sentiment === 'negative') return 'rgb(239, 68, 68)';
          return 'rgb(234, 179, 8)';
        }),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const item = data[context.dataIndex];
            return [
              `Score: ${item.score}`,
              `Volume: ${item.volume.toLocaleString()}`,
              `Change: ${item.change >= 0 ? '+' : ''}${item.change}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Sentiment Score'
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default SentimentChart;