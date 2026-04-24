
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Challenges', path: '/challenges' },
    { name: 'The Hub', path: '/hub' },
  ];

  // Only show Dashboard to authorized users
  const isAuthorized = currentUser?.role === 'backend-developer' || 
                      currentUser?.role === 'admin' || 
                      currentUser?.email === 'okunaiyadaniel13@gmail.com';

  if (isAuthorized) {
    navLinks.push({ name: 'Dashboard', path: '/admin' });
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                D
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Designa-rs</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group ${
                  location.pathname === link.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="group relative p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Toggle Dark Mode"
            >
              <div className="relative w-5 h-5 overflow-hidden">
                <div className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${darkMode ? 'rotate-0' : '-rotate-180 translate-y-10 opacity-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${!darkMode ? 'rotate-0' : 'rotate-180 -translate-y-10 opacity-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
              </div>
            </button>
            
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="hidden sm:block text-sm font-black text-slate-900 dark:text-white px-6 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-1 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-indigo-600 transition-all duration-300 group"
                >
                  <img 
                    src={currentUser.avatar} 
                    className="w-10 h-10 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                    alt="User profile"
                  />
                  <div className="hidden sm:block text-left pr-3">
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest truncate max-w-[12rem]">{currentUser.email}</p>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Account</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-2">
                        {currentUser.challengesCompleted} completed
                      </p>
                    </div>
                    
                    <div className="p-2">
                      <Link 
                        to={`/profile/${currentUser.id}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>View Portfolio</span>
                      </Link>
                      <Link 
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Edit Settings</span>
                      </Link>
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                          navigate('/login');
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!currentUser && (
              <div className="pt-4 grid grid-cols-2 gap-4">
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 rounded-2xl text-center text-sm font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 rounded-2xl text-center text-sm font-black text-white bg-indigo-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
