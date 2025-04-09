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
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">Finpulses</span>
            </Link>
            
            {/* Desktop Navigation - Moved closer to logo */}
            <div className="hidden md:flex items-center ml-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.path ? 'bg-gray-800' : 'hover:bg-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="relative mx-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for stocks..."
                />
              </div>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-yellow-600/20 rounded-full px-3 py-1 text-yellow-400">
                    <Coins className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{userData?.tokens || 0}</span>
                  </div>
                  {currentPlan && (
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-sm">
                      {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                    </span>
                  )}
                </div>
                
                {/* Profile Avatar with Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors duration-200">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-blue-800 flex items-center justify-center text-lg font-semibold">
                          {user?.displayName ? user.displayName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        {userData?.username && (
                          <p className="text-xs text-gray-300 mt-1">@{userData.username}</p>
                        )}
                        {userData?.referralId && (
                          <p className="text-xs text-blue-400 mt-1">Referral ID: {userData.referralId}</p>
                        )}
                      </div>
                      
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/profile#referral"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Referrals ({userData?.referralCount || 0})
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user && (
                <div className="relative mx-2 mb-3">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search for stocks..."
                  />
                </div>
              )}
              
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path ? 'bg-gray-800' : 'hover:bg-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  {/* User Profile Info */}
                  <div className="px-3 py-2 border-t border-b border-gray-700 my-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-700 mr-3">
                        {user?.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-blue-800 flex items-center justify-center text-lg font-semibold">
                            {user?.displayName ? user.displayName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        {userData?.username && (
                          <p className="text-xs text-gray-300">@{userData.username}</p>
                        )}
                        {userData?.referralId && (
                          <p className="text-xs text-blue-400">Referral ID: {userData.referralId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-2 justify-between items-center">
                      <div className="flex items-center bg-yellow-600/20 rounded-full px-3 py-1 text-yellow-400">
                        <Coins className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{userData?.tokens || 0}</span>
                      </div>
                      {currentPlan && (
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-sm">
                          {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    My Profile
                  </Link>
                  
                  <Link
                    to="/profile#referral"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Referrals ({userData?.referralCount || 0})
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;