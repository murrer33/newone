import { io } from 'socket.io-client';

// In a real app, this would be your WebSocket server URL
const SOCKET_URL = 'wss://api.example.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket']
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Simulate live price updates
export const simulateLivePrices = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    const randomChange = (Math.random() - 0.5) * 2; // Random value between -1 and 1
    callback({
      price: randomChange,
      timestamp: new Date().toISOString()
    });
  }, 3000); // Update every 3 seconds

  return () => clearInterval(interval);
};