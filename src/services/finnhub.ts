// finnhub.ts
export const listenToLivePrices = (
  symbols: string[],
  callback: (data: { symbol: string; price: number; timestamp: string }) => void
) => {
  const apiKey = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0';
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

  socket.onopen = () => {
    symbols.forEach((symbol) => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'trade' && data.data) {
      data.data.forEach((trade: any) => {
        const symbol = trade.s;
        const price = trade.p;
        const timestamp = new Date().toISOString();
        callback({ symbol, price, timestamp });
      });
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    symbols.forEach((symbol) => {
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    });
    socket.close();
  };
};
