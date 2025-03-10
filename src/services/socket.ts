// This file is now deprecated as we're using Finnhub WebSocket
// Keeping the file for reference but all functionality has moved to finnhub.ts
import { io } from 'socket.io-client';

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

export const simulateLivePrices = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    const randomChange = (Math.random() - 0.5) * 2;
    callback({
      price: randomChange,
      timestamp: new Date().toISOString()
    });
  }, 3000);

  return () => clearInterval(interval);
};
