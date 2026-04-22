
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faMagic, faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { generateCustomBrief } from '../services/geminiService';
import { DesignBrief, Category } from '../types';

interface AiGeneratorProps {
  onAddChallenge: (challenge: Omit<DesignBrief, 'id'>) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ onAddChallenge }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Analyzing design trends...",
    "Consulting the color theory gods...",
    "Structuring the problem space...",
    "Selecting appropriate difficulty level...",
    "Generating deliverables...",
    "Finalizing your creative brief..."
  ];
  
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setBrief(null);
    setError(null);

    // Rotate messages every 2 seconds
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const result = await generateCustomBrief(topic);
      // Add a placeholder image based on the topic
      const placeholderImage = `https://picsum.photos/seed/${encodeURIComponent(topic)}/800/600`;
      setBrief({ ...result, image: placeholderImage, category: Category.UI_UX });
    } catch (err) {
      console.error(err);
      setError("Failed to generate brief. Please check your API configuration or try a different topic.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const [success, setSuccess] = useState(false);

  const handleAccept = () => {
    if (brief) {
      onAddChallenge({
        ...brief,
        submissionCount: 0,
        isPublished: true
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="py-20 min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-200 dark:border-indigo-800">
            <FontAwesomeIcon icon={faBolt} className="w-3 h-3 mr-2" />
            AI-Powered Creativity
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Infinite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Inspiration.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Can't find the perfect challenge? Tell our AI what you want to work on, and it will craft a professional design brief just for you.
          </p>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 mb-12 transform hover:scale-[1.01] transition-transform duration-500">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A minimalist music player for high-end speakers"
              className="flex-grow bg-transparent px-8 py-6 text-lg font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-6 rounded-[2.5rem] font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Magic Brief</span>
                  <FontAwesomeIcon icon={faMagic} className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white transition-all duration-300">
              {loadingMessages[loadingMsgIdx]}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 p-8 rounded-3xl text-center mb-12">
            <p className="text-rose-600 dark:text-rose-400 font-bold">{error}</p>
          </div>
        )}

        {/* Generated Brief Display */}
        {brief && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 dark:bg-indigo-950/40 p-12 text-white relative">
                <div className="absolute top-10 right-10">
                  <div className="bg-indigo-600 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                    {brief.difficulty}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{brief.title}</h2>
                <div className="flex items-center space-x-2 text-indigo-400 text-sm font-black uppercase tracking-widest">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                  <span>Reward: {brief.points} XP</span>
                </div>
              </div>

              <div className="p-12 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">The Problem</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium mb-8">
                      {brief.summary}
                    </p>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Required Deliverables</h3>
                    <ul className="space-y-4">
                      {brief.deliverables.map((d: string, i: number) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400 font-bold">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Recommended Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {brief.tools.map((t: string) => (
                          <span key={t} className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-700 dark:text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900">
                      <h4 className="font-black text-indigo-600 dark:text-indigo-400 mb-4 uppercase tracking-widest text-xs">Ready to start?</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">This brief is custom-built for your portfolio. Tackle it now to earn XP.</p>
                      <button 
                        onClick={handleAccept}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all"
                      >
                        Accept & Publish to Arena
                      </button>
                      {success && (
                        <p className="mt-4 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center animate-in zoom-in">
                          Brief published to the arena!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGenerator;
