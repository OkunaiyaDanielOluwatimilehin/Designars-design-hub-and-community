
import React, { useState } from 'react';
import { User, Submission } from '../types';
import { supabaseService } from '../services/supabaseService';
import { storageService } from '../services/storageService';

interface SubmissionFormProps {
  onClose: () => void;
  challengeTitle: string;
  challengeId: string;
  currentUser: User | null;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onClose, challengeTitle, challengeId, currentUser }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tools, setTools] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to submit.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedImageUrl = '';
      if (selectedFile) {
        uploadedImageUrl = await storageService.uploadSubmissionImage(selectedFile);
      } else {
        throw new Error('Please select an image for your submission.');
      }

      const submission: Omit<Submission, 'id'> = {
        challengeId,
        challengeTitle,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        imageUrl: uploadedImageUrl,
        votes: 0,
        timestamp: new Date().toISOString(),
        comments: [],
        status: 'pending'
      };

      await supabaseService.addSubmission(submission);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl text-center border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Submission Received!</h2>
          <p className="text-slate-500 dark:text-slate-400">Your points are being calculated. Great work!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Submit Entry</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Challenge: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{challengeTitle}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Area */}
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${
                imagePreview 
                  ? 'border-indigo-600 dark:border-indigo-400 overflow-hidden' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 group-hover:bg-slate-100 dark:group-hover:bg-slate-900'
              }`}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold">Drop your masterpiece here</p>
                    <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 ml-1">Your Name</label>
                <input 
                  type="text" 
                  value={currentUser?.name || ''}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none dark:text-white transition-all opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 ml-1">Tools Used</label>
                <input 
                  type="text" 
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="Figma, Blender..." 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 ml-1">Brief Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your creative process..." 
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white transition-all resize-none"
                required
              ></textarea>
            </div>

            <button 
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-black text-white transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  <span>Submit Solution</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;
