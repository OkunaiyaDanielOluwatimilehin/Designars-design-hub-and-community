
import React, { useState } from 'react';
import { DesignBrief, Category, Difficulty, Submission, Article, Resource, Job } from '../types';
import ChallengeCard from '../components/ChallengeCard';
import { storageService } from '../services/storageService';

interface AdminDashboardProps {
  onAddChallenge: (challenge: DesignBrief) => void;
  onUpdateChallenge: (brief: DesignBrief) => void;
  onDeleteChallenge: (id: string) => void;
  challenges: DesignBrief[];
  submissions: Submission[];
  onUpdateSubmission: (id: string, status: 'approved' | 'rejected') => void;
  articles: Article[];
  onAddArticle: (article: Omit<Article, 'id'>) => void;
  onDeleteArticle: (id: string) => void;
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onDeleteResource: (id: string) => void;
  jobs: Job[];
  onAddJob: (job: Omit<Job, 'id'>) => void;
  onDeleteJob: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onAddChallenge, 
  onUpdateChallenge, 
  onDeleteChallenge, 
  challenges, 
  submissions,
  onUpdateSubmission,
  articles,
  onAddArticle,
  onDeleteArticle,
  resources,
  onAddResource,
  onDeleteResource,
  jobs,
  onAddJob,
  onDeleteJob
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'hub'>('create');
  const [hubSubTab, setHubSubTab] = useState<'articles' | 'resources' | 'jobs'>('articles');
  const [formData, setFormData] = useState<Partial<DesignBrief>>({
    title: '',
    description: '',
    category: Category.UI_UX,
    difficulty: Difficulty.BEGINNER,
    points: 100,
    image: '',
    deliverables: [],
    tools: [],
    submissionCount: 0,
    isPublished: true
  });

  const [deliverableInput, setDeliverableInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'points' ? parseInt(value) : value }));
  };

  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      setFormData(prev => ({ ...prev, deliverables: [...(prev.deliverables || []), deliverableInput.trim()] }));
      setDeliverableInput('');
    }
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setFormData(prev => ({ ...prev, tools: [...(prev.tools || []), toolInput.trim()] }));
      setToolInput('');
    }
  };

  const removeItem = (type: 'deliverables' | 'tools', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await storageService.uploadChallengeImage(file);
        setFormData(prev => ({ ...prev, image: url }));
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEdit = (brief: DesignBrief) => {
    setFormData({ ...brief });
    setEditingId(brief.id);
    setActiveTab('create');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateChallenge({ ...formData as DesignBrief, id: editingId });
      setEditingId(null);
    } else {
      const newChallenge: DesignBrief = {
        ...formData as DesignBrief,
        id: (Date.now()).toString(),
        submissionCount: 0
      };
      onAddChallenge(newChallenge);
    }
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: Category.UI_UX,
      difficulty: Difficulty.BEGINNER,
      points: 100,
      image: '',
      deliverables: [],
      tools: [],
      submissionCount: 0,
      isPublished: true
    });
    setEditingId(null);
  };

  const togglePublished = (brief: DesignBrief) => {
    onUpdateChallenge({ ...brief, isPublished: !brief.isPublished });
  };

  const updateXP = (brief: DesignBrief, xp: number) => {
    onUpdateChallenge({ ...brief, points: xp });
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              Command Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          </div>
          
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex min-w-max">
              <button 
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {editingId ? 'Edit Brief' : 'Create Brief'}
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Manage Arena
              </button>
              <button 
                onClick={() => setActiveTab('hub')}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hub' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Manage Hub
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Side */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Challenge Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Neo-Futurist Watch UI" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium appearance-none">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Detail the creative problem designers need to solve..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium resize-none" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium appearance-none">
                      {Object.values(Difficulty).map(diff => <option key={diff} value={diff}>{diff}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Reward Points (XP)</label>
                    <input name="points" type="number" value={formData.points} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
                    <div className="flex gap-4">
                      <input 
                        name="image" 
                        value={formData.image} 
                        onChange={handleInputChange} 
                        placeholder="URL or Upload..." 
                        className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white font-medium" 
                        required 
                      />
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button 
                          type="button"
                          className={`h-full px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                          {isUploading ? '...' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex gap-4">
                  <button type="submit" className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    <span>{editingId ? 'Update Brief' : 'Publish to Arena'}</span>
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="bg-slate-100 dark:bg-slate-800 text-slate-400 px-8 rounded-3xl font-black text-xs uppercase tracking-widest">Cancel</button>
                  )}
                </div>

                {success && (
                  <div className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-center font-black animate-in zoom-in duration-300">
                    Brief deployed successfully.
                  </div>
                )}
              </form>
            </div>

            {/* Preview Side */}
            <div className="lg:col-span-4 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Live Deployment Preview</h3>
              <div className="sticky top-28">
                <ChallengeCard challenge={{
                  id: 'Preview',
                  title: formData.title || 'Draft Brief',
                  description: formData.description || 'Brief description preview...',
                  category: formData.category || Category.UI_UX,
                  difficulty: formData.difficulty || Difficulty.BEGINNER,
                  points: formData.points || 100,
                  image: formData.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
                  deliverables: formData.deliverables || [],
                  tools: formData.tools || [],
                  submissionCount: 0
                }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Brief Details</th>
                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">XP Reward</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {challenges.map(brief => (
                    <tr key={brief.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => togglePublished(brief)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${brief.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                        >
                          {brief.isPublished ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <img src={brief.image} className="w-12 h-12 rounded-xl object-cover mr-4" alt="Brief" />
                          <div>
                            <div className="font-black text-slate-900 dark:text-white text-sm">{brief.title}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{brief.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <input 
                          type="number" 
                          value={brief.points} 
                          onChange={(e) => updateXP(brief, parseInt(e.target.value))}
                          className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-black text-indigo-600 outline-none"
                        />
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => handleEdit(brief)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M15.482 3.482a2.121 2.121 0 113 3L9.75 16.25l-4 1 1-4 8.732-8.768z"/></svg></button>
                        <button onClick={() => onDeleteChallenge(brief.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'hub' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex min-w-max space-x-4">
                {(['articles', 'resources', 'jobs'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHubSubTab(tab)}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${hubSubTab === tab ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {hubSubTab === 'articles' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Publish Article</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  onAddArticle({
                    title: data.get('title') as string,
                    excerpt: data.get('excerpt') as string,
                    content: data.get('content') as string,
                    author: data.get('author') as string,
                    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.get('author')}`,
                    category: data.get('category') as string,
                    image: data.get('image') as string,
                    publishedAt: new Date().toISOString().split('T')[0],
                    readTime: data.get('readTime') as string,
                  });
                  form.reset();
                  setSuccess(true);
                  setTimeout(() => setSuccess(false), 3000);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input name="title" placeholder="Article Title" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <input name="category" placeholder="Category (e.g. UI/UX)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  </div>
                  <textarea name="excerpt" placeholder="Short Excerpt" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" rows={2} required />
                  <textarea name="content" placeholder="Full Content (Markdown supported)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" rows={6} required />
                  <div className="grid grid-cols-3 gap-6">
                    <input name="author" placeholder="Author Name" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <input name="readTime" placeholder="Read Time (e.g. 5 min)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <input name="image" placeholder="Cover Image URL" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Publish Article</button>
                </form>

                <div className="mt-12">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Recent Articles</h4>
                  <div className="space-y-4">
                    {articles.map(article => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <img src={article.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{article.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{article.author} • {article.publishedAt}</p>
                          </div>
                        </div>
                        <button onClick={() => onDeleteArticle(article.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {hubSubTab === 'resources' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Add Resource</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  onAddResource({
                    title: data.get('title') as string,
                    description: data.get('description') as string,
                    url: data.get('url') as string,
                    category: data.get('category') as any,
                    tags: (data.get('tags') as string).split(',').map(t => t.trim()),
                  });
                  form.reset();
                  setSuccess(true);
                  setTimeout(() => setSuccess(false), 3000);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input name="title" placeholder="Resource Title" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <select name="category" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium appearance-none" required>
                      <option value="Tools">Tools</option>
                      <option value="Assets">Assets</option>
                      <option value="Inspiration">Inspiration</option>
                      <option value="Learning">Learning</option>
                    </select>
                  </div>
                  <textarea name="description" placeholder="Description" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" rows={2} required />
                  <div className="grid grid-cols-2 gap-6">
                    <input name="url" placeholder="Resource URL" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <input name="tags" placeholder="Tags (comma separated)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Add Resource</button>
                </form>

                <div className="mt-12">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Recent Resources</h4>
                  <div className="space-y-4">
                    {resources.map(res => (
                      <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">{res.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{res.category} • {res.url}</p>
                        </div>
                        <button onClick={() => onDeleteResource(res.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {hubSubTab === 'jobs' && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Post Job</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  onAddJob({
                    title: data.get('title') as string,
                    company: data.get('company') as string,
                    location: data.get('location') as string,
                    type: data.get('type') as any,
                    salary: data.get('salary') as string,
                    url: data.get('url') as string,
                    postedAt: 'Just now',
                    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${data.get('company')}`,
                  });
                  form.reset();
                  setSuccess(true);
                  setTimeout(() => setSuccess(false), 3000);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input name="title" placeholder="Job Title" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <input name="company" placeholder="Company Name" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <input name="location" placeholder="Location (e.g. Remote)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                    <select name="type" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium appearance-none" required>
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <input name="salary" placeholder="Salary Range" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  </div>
                  <input name="url" placeholder="Application URL" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium" required />
                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Post Job</button>
                </form>

                <div className="mt-12">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Recent Job Posts</h4>
                  <div className="space-y-4">
                    {jobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <img src={job.logo} className="w-10 h-10 rounded-xl" alt="" />
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{job.title}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        <button onClick={() => onDeleteJob(job.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
