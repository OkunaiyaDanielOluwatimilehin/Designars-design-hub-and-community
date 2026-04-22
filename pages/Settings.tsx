
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faBell, faSave } from '@fortawesome/free-solid-svg-icons';
import { User } from '../types';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser }) => {
  const [user, setUser] = useState(currentUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onUpdateUser(user);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Public Profile', icon: faUser },
              { id: 'account', label: 'Account', icon: faLock },
              { id: 'notifications', label: 'Notifications', icon: faBell }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center space-x-3 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
                    : 'text-slate-500 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm transition-colors">
            <form onSubmit={handleSave} className="space-y-8">
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center space-x-8">
                    <img src={user.avatar} className="w-24 h-24 rounded-[2rem] shadow-xl border-4 border-slate-50 dark:border-slate-800" alt="Avatar" />
                    <div>
                      <button type="button" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-black text-xs hover:scale-105 transition-all">Change Avatar</button>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Recommended: Square 400x400 PNG/JPG</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={user.name} 
                        onChange={e => setUser({...user, name: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                      <input 
                        type="text" 
                        value={user.location || ''} 
                        onChange={e => setUser({...user, location: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Biography</label>
                    <textarea 
                      rows={4}
                      value={user.bio || ''} 
                      onChange={e => setUser({...user, bio: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
                      <input 
                        type="text" 
                        value={user.website || ''} 
                        onChange={e => setUser({...user, website: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Twitter Username</label>
                      <input 
                        type="text" 
                        value={user.twitter || ''} 
                        onChange={e => setUser({...user, twitter: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email} 
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-500 cursor-not-allowed font-medium"
                      disabled
                    />
                    <p className="text-[10px] text-slate-400 font-bold ml-1">Contact support to change your primary email.</p>
                  </div>

                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4">Privacy Settings</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Public Portfolio</p>
                        <p className="text-xs text-slate-500">Allow anyone to view your profile and submissions.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setUser({...user, isPublic: !user.isPublic})}
                        className={`w-14 h-8 rounded-full transition-all relative ${user.isPublic ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${user.isPublic ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
                    {[
                      { title: 'New Challenges', desc: 'Get alerted when fresh briefs are released.' },
                      { title: 'Community Feedback', desc: 'Notifications for new comments on your work.' },
                      { title: 'Ranking Changes', desc: 'Weekly summaries of your leaderboard position.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <button 
                          type="button"
                          className="w-14 h-8 rounded-full bg-indigo-600 relative"
                        >
                          <div className="absolute top-1 left-7 w-6 h-6 rounded-full bg-white shadow-sm"></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center space-x-3"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Save Changes</span>
                      <FontAwesomeIcon icon={faSave} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
