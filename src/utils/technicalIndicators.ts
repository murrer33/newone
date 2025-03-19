import { HistoricalData } from '../types';

export const calculateSMA = (data: HistoricalData[], period: number): number[] => {
  const sma: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push(sum / period);
  }
  
  return sma;
};

export const calculateEMA = (data: HistoricalData[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  ema.push(sum / period);
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    const currentEMA = (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEMA);
  }
  
  // Fill initial values with NaN
  const initialNaN = Array(period - 1).fill(NaN);
  return [...initialNaN, ...ema];
};

export const calculateRSI = (data: HistoricalData[], period: number): number[] => {
  const rsi: number[] = [];
  const changes: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }
  
  // Calculate average gains and losses
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      rsi.push(NaN);
      continue;
    }
    
    let avgGain = 0;
    let avgLoss = 0;
    
    for (let j = i - period; j < i; j++) {
      if (changes[j] > 0) {
        avgGain += changes[j];
      } else {
        avgLoss -= changes[j];
      }
    }
    
    avgGain /= period;
    avgLoss /= period;
    
    // Calculate RSI
    const rs = avgGain / avgLoss;
    const currentRSI = 100 - (100 / (1 + rs));
    rsi.push(currentRSI);
  }
  
  return rsi;
};

export const calculateMACD = (data: HistoricalData[]): { macd: number[], signal: number[], histogram: number[] } => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macd: number[] = [];
  const signal: number[] = [];
  const histogram: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < 25) {
      macd.push(NaN);
      signal.push(NaN);
      histogram.push(NaN);
      continue;
    }
    
    const currentMACD = ema12[i] - ema26[i];
    macd.push(currentMACD);
    
    // Calculate signal line (9-day EMA of MACD)
    if (i >= 33) {
      let signalSum = 0;
      for (let j = 0; j < 9; j++) {
        signalSum += macd[i - j];
      }
      const currentSignal = signalSum / 9;
      signal.push(currentSignal);
      
      // Calculate histogram
      histogram.push(currentMACD - currentSignal);
    } else {
      signal.push(NaN);
      histogram.push(NaN);
    }
  }
  
  return { macd, signal, histogram };
};

export const calculateBollingerBands = (data: HistoricalData[], period: number = 20, stdDev: number = 2): {
  upper: number[],
  middle: number[],
  lower: number[]
} => {
  const sma = calculateSMA(data, period);
  const upper: number[] = [];
  const middle: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      middle.push(NaN);
      lower.push(NaN);
      continue;
    }
    
    // Calculate standard deviation
    let sumSquaredDiff = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - sma[i];
      sumSquaredDiff += diff * diff;
    }
    const stdDeviation = Math.sqrt(sumSquaredDiff / period);
    
    middle.push(sma[i]);
    upper.push(sma[i] + (stdDeviation * stdDev));
    lower.push(sma[i] - (stdDeviation * stdDev));
  }
  
  return { upper, middle, lower };
}; 