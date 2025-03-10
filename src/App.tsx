import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StockProvider } from './contexts/StockContext'; // Import the StockProvider
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MarketPage from './pages/MarketPage';
import StockDetail from './pages/StockDetail';
import Watchlist from './pages/Watchlist';
import Screener from './pages/Screener';
import StockPage from './pages/StockPage';
import PopularStocks from './pages/PopularStocks';
import TrendingStocks from './pages/TrendingStocks';
import StockComparison from './pages/StockComparison';

function App() {
  return (
    <Router>
      <StockProvider> {/* Wrap the app with StockProvider */}
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/stock/:symbol" element={<StockPage />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/screener" element={<Screener />} />
              <Route path="/popular-stocks" element={<PopularStocks />} />
              <Route path="/trending-stocks" element={<TrendingStocks />} />
              <Route path="/compare-stocks" element={<StockComparison />} />
            </Routes>
          </main>
        </div>
      </StockProvider>
    </Router>
  );
}

export default App;
