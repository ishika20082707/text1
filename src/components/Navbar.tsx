import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { Menu, X, LogOut, User, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useBeacon();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admissions', path: '/admission' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single element brand wordmark */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <GraduationCap className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-105" />
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Beacon College
            </span>
          </Link>

          {/* Zone 2: 4-6 text links (hidden on mobile, visible on medium+ viewports) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link, idx) => {
              const isSecondLink = idx === 1;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isSecondLink
                      ? isActive(link.path)
                        ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600'
                        : 'text-red-600 hover:text-red-700'
                      : isActive(link.path)
                        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                        : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions (login or dashboard links) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <User className="h-3.5 w-3.5" />
                  {currentUser.role === 'admin' ? 'Admin Panel' : 'My Portal'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/login?mode=register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all whitespace-nowrap"
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden gap-2">
            {currentUser && (
              <Link
                to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                title="My Dashboard"
              >
                <User className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation (aggregate sticky height <15% of viewport height) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-fadeIn">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <div className="px-3 py-1.5 text-xs text-slate-500 font-medium truncate">
                    Logged in as: <span className="font-semibold text-slate-700">{currentUser.fullName}</span>
                  </div>
                  <Link
                    to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                  >
                    <User className="h-4 w-4" />
                    {currentUser.role === 'admin' ? 'Admin Panel' : 'My Portal'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login?mode=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
