import { HistoricalData } from '../types';

interface Prediction {
  date: string;
  value: number;
  lower_bound: number;
  upper_bound: number;
  confidence: number;
}

// Simulate ARIMA predictions in JavaScript
export const getPredictions = async (historicalData: HistoricalData[]): Promise<Prediction[]> => {
  // Get the last price and date
  const lastPrice = historicalData[historicalData.length - 1].close;
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  // Calculate simple moving average and standard deviation
  const window = 20;
  const prices = historicalData.map(d => d.close);
  const sma = prices.slice(-window).reduce((a, b) => a + b, 0) / window;
  const std = Math.sqrt(
    prices.slice(-window)
      .map(x => Math.pow(x - sma, 2))
      .reduce((a, b) => a + b, 0) / window
  );

  // Generate predictions for next 7 days
  const predictions: Prediction[] = [];
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + i);

    // Simulate ARIMA-like prediction with trend and volatility
    const trend = (sma - prices[prices.length - window]) / window;
    const volatility = std * Math.sqrt(i);
    const predictedValue = lastPrice + (trend * i) + (Math.random() - 0.5) * volatility;
    
    predictions.push({
      date: nextDate.toISOString().split('T')[0],
      value: predictedValue,
      lower_bound: predictedValue - volatility,
      upper_bound: predictedValue + volatility,
      confidence: Math.max(95 - (i * 5), 60) // Confidence decreases with time
    });
  }

  return predictions;
};