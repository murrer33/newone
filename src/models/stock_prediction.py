import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA

def prepare_data(historical_data):
    # Convert historical data to pandas DataFrame
    df = pd.DataFrame(historical_data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date')
    return df['close']

def train_arima_model(data):
    # Train ARIMA model with fixed parameters (1,1,1)
    model = ARIMA(data, order=(1,1,1))
    model_fit = model.fit()
    return model_fit

def predict_future(model, days=7):
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

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    historical_data = json.loads(input_data)
    
    # Prepare data
    prices = prepare_data(historical_data)
    
    # Train model
    model = train_arima_model(prices)
    
    # Make predictions
    predictions = predict_future(model)
    
    # Return predictions as JSON
    print(json.dumps(predictions))

if __name__ == '__main__':
    main()