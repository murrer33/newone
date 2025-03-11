// finnhub.ts
export const listenToLivePrices = (
  symbols: string[],
  callback: (data: {
    symbol: string;
    price: number;
    timestamp: string;
  }) => void,
) => {
  const apiKey = "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng"; //Defined here
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`); // Line 11

  socket.onopen = () => {
    console.log("WebSocket connected");
    symbols.forEach((symbol) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "trade" && data.data) {
      data.data.forEach((trade: any) => {
        const symbol = trade.s;
        const price = trade.p;
        const timestamp = new Date().toISOString();
        callback({ symbol, price, timestamp });
      });
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      symbols.forEach((symbol) => {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
      });
    }
    if (
      socket.readyState !== WebSocket.CLOSED &&
      socket.readyState !== WebSocket.CLOSING
    ) {
      socket.close();
    }
  };
};
