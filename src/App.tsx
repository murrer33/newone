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
import { useWaitlistCheck } from './utils/waitlistCheck';
import WaitlistPage from './pages/WaitlistPage';
import PaymentSuccess from "./pages/PaymentSuccess";
import DemoStock from "./pages/DemoStock";
import Navbar from './components/Navbar';

const WaitlistWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the waitlist check hook to handle redirects
  const { isWaitlisted, isLoading } = useWaitlistCheck();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Render children directly - redirects are handled by the hook
  return <>{children}</>;
};

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
                    <Route path="/home" element={<Home />} />
                    <Route path="/waitlist" element={<WaitlistPage />} />
                    <Route path="/demo-stock" element={<DemoStock />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    {/* Disable Register route and redirect to waitlist */}
                    <Route path="/register" element={<Navigate to="/waitlist" replace />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Payment Routes */}
                    <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <Dashboard />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/market" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <MarketPage />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/stock/:symbol" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <StockPage />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/watchlist" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <Watchlist />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/screener" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <Screener />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/economic-news" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <EconomicalNews />
                        </WaitlistWrapper>
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <WaitlistWrapper>
                          <UserProfile />
                        </WaitlistWrapper>
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
