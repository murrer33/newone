import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AdvisorForum from "./pages/AdvisorForum";

// NavbarWrapper to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  const hiddenNavbarPaths = ['/', '/home', '/about', '/blog', '/pricing'];
  
  const shouldShowNavbar = !hiddenNavbarPaths.includes(location.pathname);
  
  return shouldShowNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <TokenProvider>
            <StockProvider>
              <SubscriptionProvider>
                
                <div className="min-h-screen bg-black text-white">
                  <Routes>
                    <Route path="*" element={<NavbarWrapper />} />
                  </Routes>
                  <Routes>
                    {/* Public Routes - Accessible without authentication */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<AboutUs />} />
                    {/* Remove or redirect demo, login, register, and waitlist routes */}
                    <Route path="/demo-stock" element={<Navigate to="/" replace />} />
                    <Route path="/waitlist" element={<Navigate to="/" replace />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Navigate to="/" replace />} />
                    <Route path="/forgot-password" element={<Navigate to="/" replace />} />

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
                    <Route path="/advisor-forum" element={
                      <PrivateRoute>
                        <AdvisorForum />
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
