import { io } from 'socket.io-client';

const API_KEY = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0'; // Replace with your Finnhub API key
const SOCKET_URL = `wss://ws.finnhub.io?token=${API_KEY}`; // Define SOCKET_URL

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

// Connect to the WebSocket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect from the WebSocket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Listen for real-time price updates
export const listenToLivePrices = (symbol: string, callback: (data: { price: number; timestamp: string }) => void) => {
  socket.emit('subscribe', symbol);

  socket.on('message', (data) => {
    if (data.type === 'trade' && data.data) {
      const price = data.data[0].p;
      const timestamp = new Date().toISOString();
      callback({ price, timestamp });
    }
  });

  return () => {
    socket.emit('unsubscribe', symbol);
    socket.off('message');
  };
};
