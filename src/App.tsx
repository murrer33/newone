import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StockProvider } from "./context/StockContext";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MarketPage from "./pages/MarketPage";
import StockDetail from "./pages/StockDetail";
import Watchlist from "./pages/Watchlist";
import Screener from "./pages/Screener";
import StockPage from "./pages/StockPage";
import PopularStocks from "./pages/PopularStocks";
import TrendingStocks from "./pages/TrendingStocks";
import StockComparison from "./pages/StockComparison";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <StockProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />

                  {/* Protected Routes */}
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/market" element={<PrivateRoute><MarketPage /></PrivateRoute>} />
                  <Route path="/stock/:symbol" element={<PrivateRoute><StockPage /></PrivateRoute>} />
                  <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
                  <Route path="/screener" element={<PrivateRoute><Screener /></PrivateRoute>} />
                  <Route path="/popular-stocks" element={<PrivateRoute><PopularStocks /></PrivateRoute>} />
                  <Route path="/trending-stocks" element={<PrivateRoute><TrendingStocks /></PrivateRoute>} />
                  <Route path="/compare-stocks" element={<PrivateRoute><StockComparison /></PrivateRoute>} />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </StockProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
