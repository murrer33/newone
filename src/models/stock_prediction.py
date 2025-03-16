import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error, mean_absolute_error
import logging
from typing import List, Dict, Any, Tuple
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_bollinger_bands(df: pd.DataFrame, window: int = 20) -> pd.DataFrame:
    """Calculate Bollinger Bands."""
    df['BB_middle'] = df['close'].rolling(window=window).mean()
    df['BB_upper'] = df['BB_middle'] + 2 * df['close'].rolling(window=window).std()
    df['BB_lower'] = df['BB_middle'] - 2 * df['close'].rolling(window=window).std()
    return df

def calculate_stochastic_oscillator(df: pd.DataFrame, k_window: int = 14, d_window: int = 3) -> pd.DataFrame:
    """Calculate Stochastic Oscillator."""
    low_min = df['low'].rolling(window=k_window).min()
    high_max = df['high'].rolling(window=k_window).max()
    
    df['%K'] = 100 * ((df['close'] - low_min) / (high_max - low_min))
    df['%D'] = df['%K'].rolling(window=d_window).mean()
    return df

def calculate_adx(df: pd.DataFrame, period: int = 14) -> pd.DataFrame:
    """Calculate Average Directional Index (ADX)."""
    high = df['high']
    low = df['low']
    close = df['close']
    
    # Calculate True Range
    tr1 = high - low
    tr2 = abs(high - close.shift())
    tr3 = abs(low - close.shift())
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    
    # Calculate +DM and -DM
    up_move = high - high.shift()
    down_move = low.shift() - low
    
    plus_dm = np.where((up_move > down_move) & (up_move > 0), up_move, 0)
    minus_dm = np.where((down_move > up_move) & (down_move > 0), down_move, 0)
    
    # Calculate smoothed TR and DM
    tr_smooth = tr.rolling(window=period).mean()
    plus_dm_smooth = pd.Series(plus_dm).rolling(window=period).mean()
    minus_dm_smooth = pd.Series(minus_dm).rolling(window=period).mean()
    
    # Calculate +DI and -DI
    plus_di = 100 * (plus_dm_smooth / tr_smooth)
    minus_di = 100 * (minus_dm_smooth / tr_smooth)
    
    # Calculate DX and ADX
    dx = 100 * abs(plus_di - minus_di) / (plus_di + minus_di)
    adx = dx.rolling(window=period).mean()
    
    df['ADX'] = adx
    df['+DI'] = plus_di
    df['-DI'] = minus_di
    return df

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate technical indicators for the dataset."""
    # Calculate moving averages
    df['MA7'] = df['close'].rolling(window=7).mean()
    df['MA30'] = df['close'].rolling(window=30).mean()
    df['MA50'] = df['close'].rolling(window=50).mean()
    df['MA200'] = df['close'].rolling(window=200).mean()
    
    # Calculate RSI with multiple timeframes
    for period in [14, 21]:
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        df[f'RSI{period}'] = 100 - (100 / (1 + rs))
    
    # Calculate MACD with multiple timeframes
    for fast, slow, signal in [(12, 26, 9), (5, 13, 4)]:
        exp1 = df['close'].ewm(span=fast, adjust=False).mean()
        exp2 = df['close'].ewm(span=slow, adjust=False).mean()
        df[f'MACD_{fast}_{slow}'] = exp1 - exp2
        df[f'Signal_{fast}_{slow}'] = df[f'MACD_{fast}_{slow}'].ewm(span=signal, adjust=False).mean()
    
    # Calculate Bollinger Bands
    df = calculate_bollinger_bands(df)
    
    # Calculate Stochastic Oscillator
    df = calculate_stochastic_oscillator(df)
    
    # Calculate ADX
    df = calculate_adx(df)
    
    # Calculate Volume indicators
    df['Volume_MA20'] = df['volume'].rolling(window=20).mean()
    df['Volume_MA50'] = df['volume'].rolling(window=50).mean()
    
    # Calculate price momentum
    df['Momentum'] = df['close'].pct_change(periods=10)
    
    return df

def generate_signals(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Generate trading signals based on technical indicators."""
    signals = []
    
    # RSI Signals
    rsi14 = df['RSI14'].iloc[-1]
    rsi21 = df['RSI21'].iloc[-1]
    rsi_signal = 'neutral'
    if rsi14 < 30 and rsi21 < 30:
        rsi_signal = 'buy'
    elif rsi14 > 70 and rsi21 > 70:
        rsi_signal = 'sell'
    
    signals.append({
        'name': 'RSI (14)',
        'value': round(rsi14, 2),
        'signal': rsi_signal,
        'description': f'Relative Strength Index - Current: {round(rsi14, 2)}, 21-day: {round(rsi21, 2)}'
    })
    
    # MACD Signals
    macd = df['MACD_12_26'].iloc[-1]
    signal = df['Signal_12_26'].iloc[-1]
    macd_signal = 'neutral'
    if macd > signal and df['MACD_12_26'].iloc[-2] <= df['Signal_12_26'].iloc[-2]:
        macd_signal = 'buy'
    elif macd < signal and df['MACD_12_26'].iloc[-2] >= df['Signal_12_26'].iloc[-2]:
        macd_signal = 'sell'
    
    signals.append({
        'name': 'MACD',
        'value': round(macd, 2),
        'signal': macd_signal,
        'description': f'MACD: {round(macd, 2)}, Signal: {round(signal, 2)}'
    })
    
    # Bollinger Bands Signals
    bb_signal = 'neutral'
    current_price = df['close'].iloc[-1]
    bb_position = (current_price - df['BB_lower'].iloc[-1]) / (df['BB_upper'].iloc[-1] - df['BB_lower'].iloc[-1])
    
    if current_price < df['BB_lower'].iloc[-1]:
        bb_signal = 'buy'
    elif current_price > df['BB_upper'].iloc[-1]:
        bb_signal = 'sell'
    
    signals.append({
        'name': 'Bollinger Bands',
        'value': round(bb_position * 100, 2),
        'signal': bb_signal,
        'description': f'Price position within bands: {round(bb_position * 100, 2)}%'
    })
    
    # Stochastic Oscillator Signals
    k = df['%K'].iloc[-1]
    d = df['%D'].iloc[-1]
    stoch_signal = 'neutral'
    if k < 20 and d < 20:
        stoch_signal = 'buy'
    elif k > 80 and d > 80:
        stoch_signal = 'sell'
    
    signals.append({
        'name': 'Stochastic',
        'value': round(k, 2),
        'signal': stoch_signal,
        'description': f'%K: {round(k, 2)}, %D: {round(d, 2)}'
    })
    
    # ADX Signals
    adx = df['ADX'].iloc[-1]
    plus_di = df['+DI'].iloc[-1]
    minus_di = df['-DI'].iloc[-1]
    adx_signal = 'neutral'
    if adx > 25:
        if plus_di > minus_di:
            adx_signal = 'buy'
        else:
            adx_signal = 'sell'
    
    signals.append({
        'name': 'ADX',
        'value': round(adx, 2),
        'signal': adx_signal,
        'description': f'ADX: {round(adx, 2)}, +DI: {round(plus_di, 2)}, -DI: {round(minus_di, 2)}'
    })
    
    # Moving Averages Signals
    ma_signal = 'neutral'
    ma7 = df['MA7'].iloc[-1]
    ma30 = df['MA30'].iloc[-1]
    ma50 = df['MA50'].iloc[-1]
    
    if ma7 > ma30 > ma50:
        ma_signal = 'buy'
    elif ma7 < ma30 < ma50:
        ma_signal = 'sell'
    
    signals.append({
        'name': 'Moving Averages',
        'value': round(ma7, 2),
        'signal': ma_signal,
        'description': f'7-day: {round(ma7, 2)}, 30-day: {round(ma30, 2)}, 50-day: {round(ma50, 2)}'
    })
    
    # Volume Analysis
    volume_signal = 'neutral'
    current_volume = df['volume'].iloc[-1]
    volume_ma20 = df['Volume_MA20'].iloc[-1]
    volume_ratio = current_volume / volume_ma20
    
    if volume_ratio > 1.5 and df['close'].iloc[-1] > df['close'].iloc[-2]:
        volume_signal = 'buy'
    elif volume_ratio > 1.5 and df['close'].iloc[-1] < df['close'].iloc[-2]:
        volume_signal = 'sell'
    
    signals.append({
        'name': 'Volume',
        'value': round(volume_ratio, 2),
        'signal': volume_signal,
        'description': f'Volume ratio: {round(volume_ratio, 2)}x 20-day average'
    })
    
    # Momentum
    momentum = df['Momentum'].iloc[-1] * 100
    momentum_signal = 'neutral'
    if momentum > 2:
        momentum_signal = 'buy'
    elif momentum < -2:
        momentum_signal = 'sell'
    
    signals.append({
        'name': 'Momentum',
        'value': round(momentum, 2),
        'signal': momentum_signal,
        'description': f'10-day price momentum: {round(momentum, 2)}%'
    })
    
    return signals

def prepare_data(historical_data: List[Dict[str, Any]]) -> pd.DataFrame:
    """Prepare and validate the input data."""
    try:
        # Convert historical data to pandas DataFrame
        df = pd.DataFrame(historical_data)
        
        # Validate required columns
        required_columns = ['date', 'open', 'high', 'low', 'close', 'volume']
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"Missing required columns. Required: {required_columns}")
        
        # Convert date and sort
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Handle missing values
        df = df.fillna(method='ffill').fillna(method='bfill')
        
        # Calculate technical indicators
        df = calculate_technical_indicators(df)
        
        # Set date as index
        df = df.set_index('date')
        
        return df
    except Exception as e:
        logger.error(f"Error in data preparation: {str(e)}")
        raise

def find_best_arima_params(data: pd.Series, max_p: int = 3, max_d: int = 2, max_q: int = 3) -> tuple:
    """Find optimal ARIMA parameters using AIC."""
    best_aic = float('inf')
    best_params = (1, 1, 1)
    
    for p in range(max_p + 1):
        for d in range(max_d + 1):
            for q in range(max_q + 1):
                try:
                    model = ARIMA(data, order=(p, d, q))
                    results = model.fit()
                    if results.aic < best_aic:
                        best_aic = results.aic
                        best_params = (p, d, q)
                except:
                    continue
    
    return best_params

def train_arima_model(data: pd.Series) -> ARIMA:
    """Train ARIMA model with optimized parameters."""
    try:
        # Find optimal parameters
        best_params = find_best_arima_params(data)
        logger.info(f"Optimal ARIMA parameters: {best_params}")
        
        # Train model with optimal parameters
        model = ARIMA(data, order=best_params)
        model_fit = model.fit()
        
        # Log model summary
        logger.info(f"Model AIC: {model_fit.aic}")
        logger.info(f"Model BIC: {model_fit.bic}")
        
        return model_fit
    except Exception as e:
        logger.error(f"Error in model training: {str(e)}")
        raise

def evaluate_model(model: ARIMA, data: pd.Series) -> Dict[str, float]:
    """Evaluate model performance using various metrics."""
    # Make predictions on training data
    predictions = model.predict(start=0, end=len(data)-1)
    
    # Calculate metrics
    mse = mean_squared_error(data, predictions)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(data, predictions)
    
    return {
        'mse': mse,
        'rmse': rmse,
        'mae': mae
    }

def predict_future(model: ARIMA, days: int = 7) -> List[Dict[str, Any]]:
    """Generate future predictions with confidence intervals."""
    try:
        # Generate future predictions
        forecast = model.forecast(steps=days)
        
        # Create dates for predictions
        last_date = model.data.index[-1]
        future_dates = [last_date + timedelta(days=x+1) for x in range(days)]
        
        # Calculate confidence intervals
        pred_conf = forecast.conf_int()
        
        predictions = []
        for i in range(len(forecast)):
            predictions.append({
                'date': future_dates[i].strftime('%Y-%m-%d'),
                'value': float(forecast[i]),
                'lower_bound': float(pred_conf.iloc[i, 0]),
                'upper_bound': float(pred_conf.iloc[i, 1]),
                'confidence': 95 - (abs(pred_conf.iloc[i, 1] - pred_conf.iloc[i, 0]) / forecast[i] * 10)
            })
        
        return predictions
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        historical_data = json.loads(input_data)
        
        # Prepare data
        df = prepare_data(historical_data)
        
        # Generate technical signals
        technical_signals = generate_signals(df)
        
        # Train model
        model = train_arima_model(df['close'])
        
        # Evaluate model
        metrics = evaluate_model(model, df['close'])
        logger.info(f"Model evaluation metrics: {metrics}")
        
        # Make predictions
        predictions = predict_future(model)
        
        # Prepare response
        response = {
            'predictions': predictions,
            'model_metrics': metrics,
            'model_params': model.model.order,
            'technical_signals': technical_signals,
            'last_price': float(df['close'].iloc[-1]),
            'last_date': df.index[-1].strftime('%Y-%m-%d')
        }
        
        # Return predictions as JSON
        print(json.dumps(response))
        
    except Exception as e:
        logger.error(f"Error in main execution: {str(e)}")
        error_response = {
            'error': str(e),
            'status': 'failed'
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == '__main__':
    main()
