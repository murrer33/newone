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
// import logo from '../assets/logo.svg';

// SVG logo with circuit board design and stock chart
const Logo = () => (
  <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
    {/* Circuit board pattern */}
    <rect x="0" y="0" width="40" height="40" fill="#0f172a" rx="5" />
    <circle cx="10" cy="10" r="2" fill="#38bdf8" />
    <circle cx="30" cy="10" r="2" fill="#38bdf8" />
    <circle cx="10" cy="30" r="2" fill="#38bdf8" />
    <circle cx="30" cy="30" r="2" fill="#38bdf8" />
    <line x1="10" y1="10" x2="30" y2="10" stroke="#38bdf8" strokeWidth="1" />
    <line x1="10" y1="30" x2="30" y2="30" stroke="#38bdf8" strokeWidth="1" />
    <line x1="10" y1="10" x2="10" y2="30" stroke="#38bdf8" strokeWidth="1" />
    <line x1="30" y1="10" x2="30" y2="30" stroke="#38bdf8" strokeWidth="1" />
    <line x1="20" y1="5" x2="20" y2="35" stroke="#38bdf8" strokeWidth="1" />
    <line x1="5" y1="20" x2="35" y2="20" stroke="#38bdf8" strokeWidth="1" />
    
    {/* Stock chart line */}
    <polyline 
      points="5,25 15,15 20,28 25,10 35,18" 
      fill="none" 
      stroke="#06b6d4" 
      strokeWidth="2"
    />
    
    {/* Logo text */}
    <text x="45" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#0f172a">
      FinPulses.tech
    </text>
  </svg>
);

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
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' }
  ];

  const authenticatedLinks = [
    { name: 'Home', path: '/' },
      ];

  const navLinks = user ? authenticatedLinks : publicLinks;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center"
            >
              <Logo />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
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
            <Link
              to="/waitlist"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Join Waitlist
            </Link>
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