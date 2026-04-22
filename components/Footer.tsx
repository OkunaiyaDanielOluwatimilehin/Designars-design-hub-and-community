
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faLinkedinIn, faDribbble } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                D
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Designa-rs</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-8 font-medium">
              The ultimate destination for designers to master their craft. Access high-fidelity briefs, curated resources, and a global job board.
            </p>
            
            {/* Newsletter Form */}
            <div className="max-w-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">Subscribe to the Brief</h4>
              <form onSubmit={handleSubscribe} className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="designer@agency.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-5 pr-32 text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 dark:bg-indigo-600 text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <span>{subscribed ? 'Sent!' : 'Join'}</span>
                  {!subscribed && <FontAwesomeIcon icon={faPaperPlane} />}
                </button>
              </form>
              {subscribed && <p className="text-[10px] text-emerald-500 font-bold mt-2 animate-in fade-in slide-in-from-top-1">Success! Welcome aboard.</p>}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Challenges</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Brief Generator</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Hiring Portal</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Community</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Showcase</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workshops</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Discord Server</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Affiliates</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Guidelines</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Designa-rs Hub & Arena. Empowering designers globally.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-lg"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-lg"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-lg"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-lg"><FontAwesomeIcon icon={faDribbble} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
