import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StockProvider } from "./context/StockContext";
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
import Hero from './components/Hero';
import Whitelist from './components/Whitelist';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Modal from './components/Modal';
import './index.css';
import './styles.css';
import Home from './pages/Home';

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    alert('Login functionality will be implemented here');
    setIsLoginModalOpen(false);
    setLoginForm({ email: '', password: '' });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Add your registration logic here
    alert('Registration functionality will be implemented here');
    setIsRegisterModalOpen(false);
    setRegisterForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <StockProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar
            onLoginClick={() => setIsLoginModalOpen(true)}
            onRegisterClick={() => setIsRegisterModalOpen(true)}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
      </Router>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login"
      >
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </Modal>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register"
      >
        <form className="register-form" onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            required
          />
          <button type="submit">Register</button>
        </form>
      </Modal>
    </StockProvider>
  );
};

export default App;
