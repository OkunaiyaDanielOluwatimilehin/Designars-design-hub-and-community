
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';

interface SignupProps {
  onSignup: (user: User) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        // Create/Update profile using upsert to handle potential trigger conflicts
        // Use snake_case to match database schema
        const profileData = {
          id: data.user.id,
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          points: 0,
          challenges_completed: 0,
          rank: 0,
          skills: [],
          joined_date: new Date().toISOString(),
          notifications: true,
          is_public: true,
          role: 'designer'
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // We don't necessarily want to block the user if the profile exists or has a minor issue
          // but we should log it.
        }

        const newUser: User = {
          id: data.user.id,
          name,
          email,
          avatar: profileData.avatar,
          points: 0,
          challengesCompleted: 0,
          rank: 0,
          skills: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          notifications: true,
          isPublic: true,
          role: 'designer'
        };

        onSignup(newUser);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="hidden lg:flex absolute top-10 left-1/2 -translate-x-[450px] z-50 items-center space-x-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-all"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Link 
        to="/" 
        className="lg:hidden absolute top-8 left-8 z-50 flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Join the Elite</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in here</Link></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" 
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

            <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-1">
              By joining, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>. We value your intellectual property.
            </p>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Claim Your Profile'
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

      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-100 dark:bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Join 12,400+ designers</span>
          </div>
          <h2 className="text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Your portfolio, supercharged.</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed font-medium mb-12">
            Build a profile that companies trust. Get certified badges for every challenge you crush. Built for designers by designers.
          </p>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
            <div className="flex items-center space-x-4 mb-4">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf,ffd5dc,d1d4f9" className="w-12 h-12 rounded-full border-2 border-indigo-600" alt="Testimonial" />
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm">Sarah Jenkins</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase">Senior Product Designer</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"Designa-rs briefs are closer to reality than any other platform I've used. It's the ultimate training ground."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
