import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, User } from 'lucide-react';

import Button from './Button';
import BookingModal from './BookingModal';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, login, logout, getDashboardPath } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-user-menu]')) setIsUserMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/experts' },

    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' },
  ];

  const roleColors = { admin: 'text-purple-600', doctor: 'text-blue-600', patient: 'text-green-600' };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md pt-4 pb-3.5' : 'bg-transparent pt-5 pb-4.5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between max-w-6xl">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group shrink-0">
            <Logo />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-base font-semibold transition-colors hover:text-primary relative group py-2 ${
                    isActive ? 'text-primary' : 'text-slate-700'
                  }`
                }
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA + User */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <>
                {user.role === 'patient' && (
                  <Button variant="outline-primary" size="sm" onClick={() => setIsBookingOpen(true)}>
                    Book Appointment
                  </Button>
                )}


                {/* User Menu */}
                <div className="relative" data-user-menu>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 bg-white hover:shadow-md transition-all"
                  >
                    <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className={`text-xs font-semibold capitalize ${roleColors[user.role] || ''}`}>{user.role}</span>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User size={16} className="text-slate-400" /> My Profile
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={login}>Sign In</Button>
                <Button size="sm" onClick={() => setIsBookingOpen(true)}>Book Appointment</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto z-50">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="h-px bg-slate-100 my-2" />

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                    <p className={`text-xs font-semibold capitalize ${roleColors[user.role] || ''}`}>{user.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User size={18} /> My Profile
                </Link>

                {user.role === 'patient' && (
                  <Button onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }} className="w-full justify-center">Book Appointment</Button>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={login} className="w-full justify-center">Sign in with Google</Button>
                <Button onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }} className="w-full justify-center">Book Appointment</Button>
              </>
            )}
          </div>
        )}
      </header>

      <BookingModal key={isBookingOpen ? 'open' : 'closed'} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
};

export default Header;
