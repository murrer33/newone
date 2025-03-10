useEffect(() => {
  const fetchPrices = async () => {
    try {
      const apiKey = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0'; // Replace with your Finnhub API key

      // Fetch NASDAQ stock prices
      const updatedNasdaqStocks = await Promise.all(
        nasdaqTop50.map(async (stock) => {
          try {
            const { price } = useLivePrice(stock.symbol, 0, apiKey); // Pass the API key
            console.log(`Fetched price for ${stock.symbol}:`, price); // Log fetched price
            return { ...stock, price };
          } catch (err) {
            console.error(`Failed to fetch price for ${stock.symbol}:`, err);
            return { ...stock, price: 0 }; // Fallback price
          }
        })
      );

      // Fetch BIST stock prices
      const updatedBistStocks = await Promise.all(
        bist100.map(async (stock) => {
          try {
            const { price } = useLivePrice(stock.symbol, 0, apiKey); // Pass the API key
            console.log(`Fetched price for ${stock.symbol}:`, price); // Log fetched price
            return { ...stock, price };
          } catch (err) {
            console.error(`Failed to fetch price for ${stock.symbol}:`, err);
            return { ...stock, price: 0 }; // Fallback price
          }
        })
      );

      setNasdaqStocks(updatedNasdaqStocks);
      setBistStocks(updatedBistStocks);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch stock prices:', err);
      setError('Failed to fetch stock prices');
      setLoading(false);
    }
  };

  fetchPrices();
}, []);
