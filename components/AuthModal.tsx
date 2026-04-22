
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; avatar: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        name: 'Guest Designer',
        avatar: 'https://i.pravatar.cc/150?u=guest'
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl shadow-indigo-200 dark:shadow-none">P</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? 'Join the world-class design community.' : 'Start your journey as a pro designer today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all"
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all"
            required
          />

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
