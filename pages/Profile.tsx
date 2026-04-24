
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';

interface ProfileProps {
  currentUser: User | null;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'achievements' | 'about'>('portfolio');
  const [shareCopied, setShareCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      try {
        if (currentUser?.id === id) {
          setUser(currentUser);
        } else {
          const profile = await supabaseService.getProfile(id);
          setUser(profile);
        }
      } catch (error) {
        console.warn('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">User not found</h1>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  const handleSharePortfolio = () => {
    const url = `${window.location.origin}/#/profile/${user.id}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Portfolio Header / Hero */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-900 dark:bg-black -z-10">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="p-1 rounded-[3.5rem] bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-2xl">
                <img 
                  src={user.avatar} 
                  className="w-44 h-44 rounded-[3.4rem] border-8 border-white dark:border-slate-900 object-cover" 
                  alt={user.name} 
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              {user.name}
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mb-8 leading-relaxed">
              {user.bio || 'Multidisciplinary designer pushing the boundaries of digital experiences.'}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={handleSharePortfolio}
                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  shareCopied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-xl'
                }`}
              >
                {shareCopied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    <span>Share Portfolio</span>
                  </>
                )}
              </button>

              <div className="flex space-x-2">
                {user.twitter && (
                  <a href={`https://twitter.com/${user.twitter}`} className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-500/30 transition-all shadow-sm">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {user.github && (
                  <a href={`https://github.com/${user.github}`} className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {[
                { label: 'Challenges', value: user.challengesCompleted.toLocaleString(), color: 'text-indigo-600' },
                { label: 'Briefs Downloaded', value: '12', color: 'text-slate-900 dark:text-white' },
                { label: 'Completion', value: '94%', color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center space-x-12 border-b border-slate-200 dark:border-slate-800 mb-16">
          {(['achievements', 'about'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in slide-in-from-bottom-1"></div>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: 'ðŸš€', label: 'First Launch', desc: 'Completed 1st brief' },
              { icon: 'ðŸ’Ž', label: 'Expert Class', desc: 'Expert brief solved' },
              { icon: 'âœ¨', label: 'Contributor', desc: 'Shared 1st solution' },
              { icon: 'ðŸ”¥', label: 'Streaker', desc: '7 days active' },
              { icon: 'ðŸ’¬', label: 'Critique', desc: '10 comments left' },
              { icon: 'ðŸŒŸ', label: 'Verified', desc: 'Account verified' },
            ].map((badge, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center group hover:border-indigo-500 transition-all">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{badge.icon}</div>
                <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-1">{badge.label}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{badge.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center">
                  <span className="w-8 h-0.5 bg-indigo-600 mr-3"></span>
                  Professional Bio
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {user.bio || 'This designer prefers to let their work do the talking. A silent guardian of the pixel, a watchful protector of the user experience.'}
                </p>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-8 flex items-center">
                  <span className="w-8 h-0.5 bg-indigo-600 mr-3"></span>
                  Design Stack
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(user.skills.length > 0 ? user.skills : ['Figma', 'Sketch', 'Adobe Suite', 'Blender', 'Spline']).map(skill => (
                    <div key={skill} className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center group hover:border-indigo-500 transition-all">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mr-4 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                      <span className="font-black text-slate-700 dark:text-slate-200 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-10 text-white sticky top-32">
                <h3 className="font-black text-indigo-400 text-xs uppercase tracking-[0.2em] mb-8">Metadata</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Joined Arena</p>
                    <p className="font-black">{user.joinedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Portfolio Verified</p>
                    <p className="font-black text-emerald-400">Level 4 Certified</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Personal URL</p>
                    <p className="font-black text-indigo-400 break-all">{user.website || 'designars.arena/p/' + user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">Want a portfolio like this?</h2>
          <p className="text-indigo-100 text-xl font-medium mb-12 relative z-10 max-w-2xl mx-auto">
            Join the arena and start solving real-world briefs today. Your career is waiting.
          </p>
          <Link to="/signup" className="relative z-10 inline-block bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all">
            Join Designa-rs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;

