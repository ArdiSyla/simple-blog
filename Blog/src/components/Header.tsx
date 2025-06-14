import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector,  } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/slices/authSlice';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">WebWizards Blog</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-200 transition-colors">Dashboard</Link>
                <div className="flex items-center">
                  <span className="mr-2">{user.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-indigo-200 transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 space-y-3">
            <Link 
              to="/" 
              className="block py-2 hover:bg-indigo-700 px-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 hover:bg-indigo-700 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-indigo-500 pt-2 mt-2">
                  <div className="flex items-center px-2 py-1">
                    <User className="w-4 h-4 mr-2" />
                    <span>{user.username}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left py-2 hover:bg-indigo-700 px-2 rounded mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-indigo-500">
                <Link 
                  to="/login" 
                  className="block py-2 hover:bg-indigo-700 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-white text-indigo-600 hover:bg-indigo-100 px-2 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;