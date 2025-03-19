import React, { useEffect, useRef } from 'react';
import { HistoricalData } from '../types';

interface StockChartProps {
  data: HistoricalData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }: StockChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    // Calculate scales
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Find min and max values
    const prices = data.map((d: HistoricalData) => d.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;

    data.forEach((point: HistoricalData, index: number) => {
      const x = padding + (index / (data.length - 1)) * width;
      const y = padding + height - ((point.close - minPrice) / priceRange) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // X-axis
    ctx.moveTo(padding, padding + height);
    ctx.lineTo(canvas.width - padding, padding + height);

    // Y-axis
    ctx.moveTo(padding, padding + height);
    ctx.lineTo(padding, padding);

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels
    data.forEach((point: HistoricalData, index: number) => {
      if (index % Math.floor(data.length / 5) === 0) {
        const x = padding + (index / (data.length - 1)) * width;
        ctx.fillText(new Date(point.date).toLocaleDateString(), x, canvas.height - padding + 20);
      }
    });

    // Y-axis labels
    const numLabels = 5;
    for (let i = 0; i <= numLabels; i++) {
      const price = minPrice + (priceRange * i) / numLabels;
      const y = padding + height - (i / numLabels) * height;
      ctx.fillText(price.toFixed(2), padding - 10, y);
    }
  }, [data]);

  return (
    <div className="w-full h-[400px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
};

export default StockChart;