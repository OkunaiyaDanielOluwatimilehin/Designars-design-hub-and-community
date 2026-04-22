
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Submission, Comment } from '../types';

interface ShowcaseProps {
  submissions: Submission[];
}

const Showcase: React.FC<ShowcaseProps> = ({ submissions: initialSubmissions }) => {
  const [searchParams] = useSearchParams();
  const challengeIdFilter = searchParams.get('challenge');
  
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [visibleSubmissions, setVisibleSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    // Apply filtering based on challengeId query param
    const filtered = challengeIdFilter 
      ? initialSubmissions.filter(s => s.challengeId === challengeIdFilter)
      : initialSubmissions;
      
    setFilteredSubmissions(filtered);
    setVisibleSubmissions(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
    setPage(1); // Reset page on filter change
  }, [initialSubmissions, challengeIdFilter]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    
    setTimeout(() => {
      const nextBatch = filteredSubmissions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      setVisibleSubmissions(prev => [...prev, ...nextBatch]);
      setPage(prev => prev + 1);
      if ((page + 1) * ITEMS_PER_PAGE >= filteredSubmissions.length) setHasMore(false);
    }, 500);
  }, [page, hasMore, filteredSubmissions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">
              {challengeIdFilter ? 'Community Solutions' : 'Community Showcase'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              {challengeIdFilter 
                ? `Browsing solutions for ${visibleSubmissions[0]?.challengeTitle || 'this challenge'}.`
                : 'Verified solutions from the arena\'s top designers.'
              }
            </p>
          </div>
          
          {challengeIdFilter && (
            <Link 
              to="/showcase" 
              className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-all"
            >
              View All Showcase
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleSubmissions.length > 0 ? (
            visibleSubmissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSubmission(sub)}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden group shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={sub.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="submission" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Verified
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img src={sub.userAvatar} className="w-10 h-10 rounded-full mr-4 border-2 border-slate-100 dark:border-slate-800 shadow-sm" alt={sub.userName} />
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-sm leading-tight">{sub.userName}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">{sub.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 truncate">
                    Challenge: {sub.challengeTitle}
                  </h3>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center space-x-6 text-slate-400 dark:text-slate-500">
                      <div className="flex items-center hover:text-rose-500 transition-colors">
                        <svg className={`w-5 h-5 mr-2 ${sub.votes > 100 ? 'text-rose-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-black text-sm">{sub.votes}</span>
                      </div>
                      <div className="flex items-center hover:text-indigo-500 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-black text-sm">{sub.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No solutions yet</h3>
              <p className="text-slate-500 font-medium">Be the first to submit a solution for this challenge!</p>
              <Link to={`/challenge/${challengeIdFilter}`} className="mt-8 inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1">Start Project</Link>
            </div>
          )}
        </div>

        {visibleSubmissions.length > 0 && (
          <div ref={loaderRef} className="py-20 flex justify-center">
            {hasMore ? (
              <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Browsing history...</span>
              </div>
            ) : (
              <div className="text-slate-400 font-black uppercase tracking-widest text-xs">
                The arena has been cleared.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-3/5 bg-slate-100 dark:bg-slate-950 overflow-y-auto flex items-center justify-center p-4">
              <img src={selectedSubmission.imageUrl} className="w-full h-auto max-h-none rounded-2xl shadow-2xl" alt="Full view" />
            </div>

            <div className="md:w-2/5 flex flex-col h-full border-l border-slate-100 dark:border-slate-800">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center">
                  <img src={selectedSubmission.userAvatar} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-100 dark:border-slate-800" alt={selectedSubmission.userName} />
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight text-lg">{selectedSubmission.userName}</h4>
                    <p className="text-xs text-slate-400 font-bold">Challenge: {selectedSubmission.challengeTitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <div className="flex space-x-8">
                  <div className="text-center">
                    <div className="text-xl font-black text-slate-900 dark:text-white">{selectedSubmission.votes}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Votes</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  <span>Verified Submission</span>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Feedback ({selectedSubmission.comments.length})</h3>
                <div className="space-y-6">
                  {selectedSubmission.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <img src={comment.userAvatar} className="w-8 h-8 rounded-full flex-shrink-0" alt={comment.userName} />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-slate-900 dark:text-white">{comment.userName}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showcase;
