
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const profile = await supabaseService.getProfile(data.user.id);
        if (profile) {
          onLogin(profile);
          navigate('/');
        } else {
          setError('Profile not found.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-50 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all lg:hidden"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <span>Back Home</span>
      </Link>

      <Link 
        to="/" 
        className="hidden lg:flex absolute top-10 right-1/2 translate-x-[450px] z-50 items-center space-x-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-all"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 blur-[80px] rounded-full"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-12 border border-white/30">D</div>
          <h2 className="text-6xl font-black mb-6 leading-tight">Master your craft with Designa-rs.</h2>
          <p className="text-indigo-100 text-xl leading-relaxed font-medium">
            Join thousands of designers competing in high-stakes briefs from top global brands. Built for designers by designers.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create one for free</Link></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@designa-rs.com" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-500 dark:text-slate-400 font-bold cursor-pointer select-none">Keep me signed in</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In to Arena'
              )}
            </button>
          </form>

          <div className="mt-12 text-center relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative z-10 bg-white dark:bg-slate-950 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">or continue with</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-4 border-2 border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-black text-xs text-slate-600 dark:text-slate-300">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-4 border-2 border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-black text-xs text-slate-600 dark:text-slate-300">
              <img src="https://github.com/favicon.ico" className="w-4 h-4" alt="Github" />
              <span>Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
