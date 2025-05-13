import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TokenProvider } from "./context/TokenContext";
import { StockProvider } from "./context/StockContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StockPage from "./pages/StockPage";
import MarketPage from "./pages/MarketPage";
import PrivateRoute from "./components/PrivateRoute";
import Watchlist from "./pages/Watchlist";
import Screener from "./pages/Screener";
import EconomicalNews from "./pages/EconomicalNews";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import DatabaseCheck from "./components/DatabaseCheck";
import PaymentSuccess from "./pages/PaymentSuccess";
import DemoStock from "./pages/DemoStock";
import Navbar from './components/Navbar';
import Blog from "./pages/Blog";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <TokenProvider>
            <StockProvider>
              <SubscriptionProvider>
                {/* Database check component to verify Supabase tables */}
                <DatabaseCheck />
                
                <div className="min-h-screen bg-gray-100">
                  <Navbar />
                  <Routes>
                    {/* Public Routes - Accessible without authentication */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/waitlist" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/demo-stock" element={<DemoStock />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<AboutUs />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Payment Routes */}
                    <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    <Route path="/market" element={
                      <PrivateRoute>
                        <MarketPage />
                      </PrivateRoute>
                    } />
                    <Route path="/stock/:symbol" element={
                      <PrivateRoute>
                        <StockPage />
                      </PrivateRoute>
                    } />
                    <Route path="/watchlist" element={
                      <PrivateRoute>
                        <Watchlist />
                      </PrivateRoute>
                    } />
                    <Route path="/screener" element={
                      <PrivateRoute>
                        <Screener />
                      </PrivateRoute>
                    } />
                    <Route path="/economic-news" element={
                      <PrivateRoute>
                        <EconomicalNews />
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    } />
                  </Routes>
                </div>
              </SubscriptionProvider>
            </StockProvider>
          </TokenProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
