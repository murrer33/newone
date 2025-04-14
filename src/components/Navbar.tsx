import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Home, 
  LineChart, 
  Compass, 
  Search, 
  Eye, 
  TrendingUp, 
  Award, 
  ScanLine, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  UserCircle,
  Newspaper,
  Coins,
  Settings,
  User,
  Share2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useToken } from '../context/TokenContext';
import logo from '../assets/logo.svg';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentPlan } = useSubscription();
  const { userData } = useToken();

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const authenticatedLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Market Overview', path: '/market' },
    { name: 'Popular Stocks', path: '/popular-stocks' },
    { name: 'Trending Stocks', path: '/trending-stocks' },
    { name: 'Compare Stocks', path: '/compare-stocks' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Screener', path: '/screener' },
    { name: 'Economic News', path: '/economic-news' },
  ];

  const navLinks = user ? authenticatedLinks : publicLinks;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex-shrink-0 flex items-center"
            >
              <img
                className="h-10 w-auto"
                src={logo}
                alt="FinPulses.tech"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/demo-stock"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Try Demo
            </Link>
            {!user && (
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => window.location.href = '/waitlist'}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Join Waitlist
            </button>
            {user && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <UserCircle className="h-6 w-6" />
                  <span className="hidden md:block">{userData?.username || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;