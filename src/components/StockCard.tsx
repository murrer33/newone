this.socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data.toString());
    console.log('Received WebSocket message:', data); // Log the received data
    if (data.type === 'trade') {
      const symbol = data.data[0]?.s;
      if (symbol && this.subscribers.has(symbol)) {
        this.subscribers.get(symbol)?.forEach(callback => {
          callback({
            symbol: symbol,
            name: 'Unknown', // Replace with actual name if available
            price: data.data[0].p,
            change: data.data[0].c, // Replace with actual change if available
            changePercent: data.data[0].dp, // Replace with actual changePercent if available
          });
        });
      }
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};
