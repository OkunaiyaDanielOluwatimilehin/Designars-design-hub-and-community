
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShareAlt, faBookmark as faBookmarkSolid, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { DesignBrief, Difficulty } from '../types';

interface ChallengeCardProps {
  challenge: DesignBrief;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isSaved, onToggleSave }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(challenge.likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case Difficulty.INTERMEDIATE: return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case Difficulty.ADVANCED: return 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
      case Difficulty.EXPERT: return 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/50';
      default: return 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(challenge.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#/challenge/${challenge.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:-translate-y-2 relative">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
        )}
        <img 
          src={challenge.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'} 
          alt={challenge.title} 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} group-hover:scale-110`}
        />
        
        {/* Top Controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col space-y-2">
          {/* Save Button */}
          <button
            onClick={handleToggleSave}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${
              isSaved 
                ? 'bg-indigo-600 border-indigo-500 text-white scale-110 shadow-lg' 
                : 'bg-black/20 border-white/10 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 hover:border-indigo-500/40 hover:scale-110'
            }`}
            aria-label={isSaved ? "Remove from saved" : "Save for later"}
          >
            <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmarkRegular} className={`w-4 h-4 transition-transform ${isSaved ? 'scale-110' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border bg-black/20 border-white/10 text-slate-300 hover:bg-white/20 hover:text-white hover:scale-110"
            aria-label="Share brief"
          >
            <FontAwesomeIcon icon={faShareAlt} className="w-4 h-4" />
          </button>
        </div>

        {/* Project Number Overlay */}
        <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest z-10">
          Brief #{challenge.id.padStart(3, '0')}
        </div>
        
        {/* Difficulty Tag */}
        <div className="absolute bottom-6 left-6">
          <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{challenge.category}</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {challenge.title}
            </h3>
          </div>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium h-10">
          {challenge.description || 'Description goes here...'}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1.5 text-xs font-black transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span>{likesCount}</span>
            </button>
            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-400">
              <FontAwesomeIcon icon={faComment} />
              <span>{challenge.commentsCount || 0}</span>
            </div>
          </div>
          <Link 
            to={`/challenge/${challenge.id}`}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            View Brief
          </Link>
        </div>
      </div>
      
      {/* Points Badge (Floating) */}
      <div className="absolute top-[180px] right-6 flex flex-col items-center justify-center bg-indigo-600 text-white w-14 h-14 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none border-2 border-white/20 z-10">
        <span className="text-lg font-black leading-none">{challenge.points}</span>
        <span className="text-[8px] font-black uppercase tracking-tighter">XP</span>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsShareModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShareAlt} className="text-2xl" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Share Brief</h3>
              <p className="text-slate-500 text-sm mt-1">Spread the creative challenge.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <button className="flex flex-col items-center space-y-2 group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                  <FontAwesomeIcon icon={faTwitter} className="text-xl" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400">Twitter</span>
              </button>
              <button className="flex flex-col items-center space-y-2 group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-xl" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400">LinkedIn</span>
              </button>
              <button onClick={copyToClipboard} className="flex flex-col items-center space-y-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-xl" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <button onClick={() => setIsShareModalOpen(false)} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
