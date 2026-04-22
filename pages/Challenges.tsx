
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid, faSearch, faMagic } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import ChallengeCard from '../components/ChallengeCard';
import { Category, Difficulty, DesignBrief } from '../types';

interface ChallengesProps {
  challenges: DesignBrief[];
}

const Challenges: React.FC<ChallengesProps> = ({ challenges }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'All'>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedChallenges, setSavedChallenges] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('savedChallenges');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  useEffect(() => {
    localStorage.setItem('savedChallenges', JSON.stringify(Array.from(savedChallenges)));
  }, [savedChallenges]);

  const toggleSave = (id: string) => {
    setSavedChallenges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredChallenges = challenges.filter(c => 
    (filter === 'All' || c.category === filter) && 
    (diffFilter === 'All' || c.difficulty === diffFilter) &&
    (!showSavedOnly || savedChallenges.has(c.id))
  );

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">The Arena</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Master your craft with industry-standard briefs. Choose a challenge, download the requirements, and build a portfolio that gets you hired.
            </p>
          </div>
          
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
              showSavedOnly 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            <FontAwesomeIcon icon={showSavedOnly ? faBookmarkSolid : faBookmarkRegular} className="w-4 h-4" />
            <span>{showSavedOnly ? 'Showing Saved' : 'View Saved'}</span>
            {savedChallenges.size > 0 && !showSavedOnly && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px]">
                {savedChallenges.size}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-8 mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Categories</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full animate-pulse">More categories coming soon</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                    filter === cat 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty Levels</h3>
            <div className="flex flex-wrap gap-2">
              {['All', ...Object.values(Difficulty)].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDiffFilter(diff as any)}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                    diffFilter === diff 
                      ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-xl' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                isSaved={savedChallenges.has(challenge.id)}
                onToggleSave={toggleSave}
              />
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400 text-6xl mb-6">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                {showSavedOnly ? 'You haven\'t saved any briefs yet' : 'No briefs match your selection'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                {showSavedOnly 
                  ? 'Browse the arena and bookmark challenges you want to tackle later.' 
                  : 'Try broadening your filters or use our AI to generate a custom one.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => { setFilter('All'); setDiffFilter('All'); setShowSavedOnly(false); }}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Clear all filters
                </button>
                <Link 
                  to="/generator"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1"
                >
                  Try AI Generator
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* AI Brief Generator Banner */}
        <div className="mt-24 p-12 bg-indigo-600 rounded-[3rem] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 -z-0 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl font-black mb-4">Can't find the perfect brief?</h2>
              <p className="text-indigo-100 text-lg font-medium">Use our AI-powered brief generator to create a custom challenge based on any topic you can imagine.</p>
            </div>
            <Link 
              to="/generator"
              className="px-12 py-5 bg-white text-indigo-600 rounded-3xl font-black text-lg shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
            >
              Generate Custom Brief
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
