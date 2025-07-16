import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StockProvider } from "./context/StockContext";
import Home from "./pages/Home";
import MarketPage from "./pages/MarketPage";
import StockPage from "./pages/StockPage";
import Navbar from './components/Navbar';

const App: React.FC = () => (
  <StockProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/stock/:symbol" element={<StockPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  </StockProvider>
);

export default App;
