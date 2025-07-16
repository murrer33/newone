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
  ChevronDown,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useToken } from '../context/TokenContext';
// import logo from '../assets/logo.svg';

// SVG logo with circuit board design and stock chart
const Logo = ({ linkTo = "/" }: { linkTo?: string }) => (
  <Link to={linkTo}>
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
      <text x="45" y="25" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#ffffff">
        FinPulses.tech
      </text>
    </svg>
  </Link>
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
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Blog', path: '/blog', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'About Us', path: '/about', icon: <Compass className="h-5 w-5" /> }
  ];

  const authenticatedLinks = [
    { name: 'Economic News', path: '/economic-news', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'Popular Stocks', path: '/market', icon: <TrendingUp className="h-5 w-5" /> },
    { name: 'Market', path: '/market', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Screener', path: '/screener', icon: <ScanLine className="h-5 w-5" /> },
  ];

  const navLinks = user ? authenticatedLinks : publicLinks;

  return (
    <nav className="bg-gray-900 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo linkTo={user ? "/dashboard" : "/"} />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {/* Only show navLinks for authenticated users, no profile menu or logout */}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </>
            )}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;