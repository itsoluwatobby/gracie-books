import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, BookOpen, Search } from 'lucide-react';
import Button from '../ui/Button';
import useAuthContext from '../../context/useAuthContext';
import useCartContext from '../../context/useCartContext';
import { userAuthenticationAPI } from '../../composables/auth';
import { userService } from '../../services';
import { UserRole } from '../../utils/constants';
import { PageRoutes } from '../../utils/pageRoutes';
import { initAppState } from '../../utils/initVariables';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    user,
    appName,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
  } = useAuthContext();

  const { totalItems } = useCartContext();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>(initAppState);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const logout = async () => {
    if (appState.isLoading) return;

    setAppState((prev) => ({ ...prev, isLoading: true }));
    try {
      await userAuthenticationAPI.logout();
      if (user && user.isLoggedIn) {
        await userService.updateUser(user.id!, { isLoggedIn: false });
      }
      setUser(null);
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      navigate(PageRoutes.home)

      toast.success("Logout successful");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(`MESSAGE: ${err.message}`)
      setAppState((prev) => ({ ...prev, errMsg: err.message }));
    } finally {
      setAppState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50 lg:px-6">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to={PageRoutes.home} className="flex items-center space-x-2 mr-4">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">{appName.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to={PageRoutes.home} className={`hover:text-blue-200 transition-colors ${pathname !== PageRoutes.home ? 'text-blue-100' : ''}`}>Home</Link>
            <Link to={PageRoutes.books} className={`hover:text-blue-200 transition-colors ${pathname !== PageRoutes.books ? 'text-blue-100' : ''}`}>Browse</Link>
            <Link to={PageRoutes.genres} className={`hover:text-blue-200 transition-colors ${pathname !== PageRoutes.genres ? 'text-blue-100' : ''}`}>Genres</Link>
            <Link to={PageRoutes.newRelease} className={`hover:text-blue-200 transition-colors ${pathname !== PageRoutes.newRelease ? 'text-blue-100' : ''}`}>New Releases</Link>
          </nav>

          {/* Search Form - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {
              user?.role !== UserRole.admin ?
                <Link to={PageRoutes.cart} className="relative hover:text-blue-200 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              : null
            }

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                  <User className="h-6 w-6" />
                  <span>{user?.fullName}</span>
                </button>
                <div className="absolute right-0 -mt-1 h-36 w-48 rounded-md shadow-lg py-1 z-10 hidden group-hover:block duration-500">
                  <div className="w-full mt-6 rounded-md bg-white h-fit py-1">
                    <Link
                      to={`${PageRoutes.profile}/${user?.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    {
                      !user?.isAdmin ? (
                        <Link
                          to={PageRoutes.orders}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      ):(
                      <Link
                        to={PageRoutes.dashboard}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={PageRoutes.auth.login}>
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to={PageRoutes.auth.signup}>
                  <Button variant="secondary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            {/* Search Form - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Navigation Links - Mobile */}
            <nav className="flex flex-col space-y-2">
              <Link
                to={PageRoutes.home}
                className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={PageRoutes.books}
                className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to={PageRoutes.genres}
                className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                to={PageRoutes.newRelease}
                className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Releases
              </Link>
              {
                user?.role !== UserRole.admin ?
                  <Link
                    to={PageRoutes.cart}
                    className="px-2 py-1 hover:bg-blue-800 rounded transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                : null
              }

              {isAuthenticated ? (
                <>
                  <Link
                    to={`${PageRoutes.profile}/${user?.id}`}
                    className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  {
                    !user?.isAdmin ?
                      <Link
                        to={PageRoutes.orders}
                        className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    : null
                  }
                  {user?.isAdmin ? (
                    <Link
                      to={PageRoutes.dashboard}
                      className="px-2 py-1 hover:bg-blue-800 rounded transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    onClick={logout}
                    className="px-2 py-1 text-left hover:bg-blue-800 rounded transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 mt-2">
                  <Link
                    to={PageRoutes.auth.login}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="secondary" size="sm" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link
                    to={PageRoutes.auth.signup}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="secondary" size="sm" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;