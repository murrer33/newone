import { io, Socket } from 'socket.io-client';

export const listenToLivePrices = (
  symbol: string,
  callback: (data: { price: number; timestamp: string }) => void
) => {
  const apiKey = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0'; // Hardcoded API key

  // Initialize the WebSocket connection with the API key
  const socket: Socket = io('wss://ws.finnhub.io', {
    query: {
      token: apiKey,
    },
  });

  // Subscribe to the symbol
  socket.emit('subscribe', symbol);

  // Listen for updates
  socket.on('message', (data: any) => {
    if (data.type === 'trade' && data.data) {
      const price = data.data[0].p;
      const timestamp = new Date().toISOString();
      callback({ price, timestamp });
    }
  });

  // Cleanup function to unsubscribe
  return () => {
    socket.emit('unsubscribe', symbol);
    socket.disconnect(); // Disconnect the WebSocket
  };
};
