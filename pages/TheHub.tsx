
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShareAlt, faExternalLinkAlt, faPaperPlane, faClock, faMapMarkerAlt, faBriefcase, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Article, Resource, Job } from '../types';
import { supabaseService } from '../services/supabaseService';

const InteractionButtons: React.FC<{ 
  likes?: number; 
  comments?: number; 
  onLike?: () => void; 
  onComment?: () => void; 
  onShare?: () => void;
  liked?: boolean;
}> = ({ likes = 0, comments = 0, onLike, onComment, onShare, liked }) => (
  <div className="flex items-center space-x-4">
    <button 
      onClick={(e) => { e.preventDefault(); onLike?.(); }}
      className={`flex items-center space-x-1.5 text-xs font-black transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
    >
      <FontAwesomeIcon icon={faHeart} />
      <span>{likes}</span>
    </button>
    <button 
      onClick={(e) => { e.preventDefault(); onComment?.(); }}
      className="flex items-center space-x-1.5 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors"
    >
      <FontAwesomeIcon icon={faComment} />
      <span>{comments}</span>
    </button>
    <button 
      onClick={(e) => { e.preventDefault(); onShare?.(); }}
      className="flex items-center space-x-1.5 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors"
    >
      <FontAwesomeIcon icon={faShareAlt} />
    </button>
  </div>
);

const TheHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'resources' | 'jobs'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [articleFilter, setArticleFilter] = useState<string>('All');
  const [resourceFilter, setResourceFilter] = useState<string>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Define mock data
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'The Future of Motion Design in 2026',
          excerpt: 'How AI and real-time engines are reshaping the way we think about movement. From neural radiance fields to procedural animation, the tools are changing, but the principles remain.',
          content: 'The landscape of motion design is undergoing a seismic shift. With the integration of AI-driven procedural animation and real-time rendering engines like Unreal Engine 5.4, designers are now able to create complex, reactive environments that were previously impossible. This article explores the intersection of human creativity and machine intelligence in the next era of digital movement.',
          author: 'Sarah Chen',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          category: 'Motion Design',
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
          publishedAt: '2026-04-01',
          readTime: '5 min'
        },
        {
          id: '2',
          title: 'Mastering the Grid: A Guide for UI Designers',
          excerpt: 'Why the 8pt grid is still the king of layout systems. Learn how to create consistent, scalable interfaces that work across all devices and screen sizes.',
          content: 'Consistency is the hallmark of professional UI design. The 8pt grid system provides a mathematical framework that ensures every element on your screen relates to every other element in a harmonious way. We break down the technical implementation of grid systems in modern design tools like Figma and how to handle edge cases in responsive web design.',
          author: 'Marcus Wright',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
          category: 'UI/UX',
          image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800',
          publishedAt: '2026-03-28',
          readTime: '8 min'
        },
        {
          id: '3',
          title: 'The Psychology of Color in Branding',
          excerpt: 'How to use color theory to evoke specific emotions and build trust with your audience. A deep dive into the subconscious impact of your palette.',
          content: 'Color is more than just an aesthetic choice; it is a powerful communication tool. Blue conveys trust and stability, while red can trigger urgency or passion. Understanding the cultural and psychological associations of color is vital for any brand designer looking to create a lasting impact. This guide provides a framework for selecting palettes that align with brand values.',
          author: 'Elena Rodriguez',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
          category: 'Branding',
          image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800',
          publishedAt: '2026-03-25',
          readTime: '6 min'
        },
        {
          id: '4',
          title: 'Typography Trends for the Modern Web',
          excerpt: 'Variable fonts, brutalist layouts, and the return of the serif. Explore the typographic landscape of 2026 and how to stay ahead.',
          content: 'Typography is the voice of your interface. In 2026, we are seeing a move away from safe, geometric sans-serifs towards more expressive, high-contrast serifs and experimental variable fonts. We analyze why these trends are emerging and how to balance readability with bold creative expression in your next project.',
          author: 'James Wilson',
          authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
          category: 'Typography',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
          publishedAt: '2026-03-20',
          readTime: '7 min'
        }
      ];

      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Design System Checklist',
          description: 'A comprehensive list of everything you need for a robust design system. From tokens to components and documentation standards.',
          url: 'https://designsystemchecklist.com',
          category: 'Tools',
          tags: ['System', 'UI', 'Documentation']
        },
        {
          id: '2',
          title: 'Free Mesh Gradients',
          description: '100+ high-quality mesh gradients for your next project. Perfect for backgrounds, hero sections, and abstract art.',
          url: 'https://meshgradients.design',
          category: 'Assets',
          tags: ['Gradients', 'Backgrounds', 'Assets']
        },
        {
          id: '3',
          title: 'Iconic Icon Set',
          description: 'A massive library of 5000+ open-source icons for web and mobile apps. SVG and React components included.',
          url: 'https://iconic.io',
          category: 'Assets',
          tags: ['Icons', 'SVG', 'Library']
        },
        {
          id: '4',
          title: 'Color Palette Generator',
          description: 'AI-powered color palette generator that creates harmonious schemes based on your brand keywords.',
          url: 'https://coolors.co',
          category: 'Tools',
          tags: ['Color', 'AI', 'Branding']
        },
        {
          id: '5',
          title: 'Figma Auto-Layout Masterclass',
          description: 'A comprehensive guide to mastering auto-layout for responsive and scalable design systems.',
          url: '#',
          category: 'Learning',
          tags: ['Figma', 'UI Design', 'Systems']
        },
        {
          id: '6',
          title: 'Accessible Contrast Checker',
          description: 'Ensure your designs meet WCAG standards with this real-time accessibility testing tool.',
          url: '#',
          category: 'Accessibility',
          tags: ['WCAG', 'UX', 'Testing']
        }
      ];

      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Product Designer',
          company: 'TechFlow',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120k - $160k',
          url: '#',
          postedAt: '2 days ago',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF'
        },
        {
          id: '2',
          title: 'Visual Designer',
          company: 'Creative Studio',
          location: 'London, UK',
          type: 'Contract',
          salary: '£400/day',
          url: '#',
          postedAt: '5 hours ago',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS'
        },
        {
          id: '3',
          title: 'UX Researcher',
          company: 'Global Bank',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$110k - $140k',
          url: '#',
          postedAt: '1 day ago',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GB'
        },
        {
          id: '4',
          title: 'Motion Graphics Artist',
          company: 'GameWorks',
          location: 'Remote',
          type: 'Freelance',
          salary: '$80/hr',
          url: '#',
          postedAt: '3 days ago',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GW'
        },
        {
          id: '5',
          title: 'Lead Brand Designer',
          company: 'EcoStart',
          location: 'Berlin, DE',
          type: 'Full-time',
          salary: '€70k - €95k',
          url: '#',
          postedAt: '1 day ago',
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ES'
        }
      ];

      // Set mock data as baseline
      setArticles(mockArticles);
      setResources(mockResources);
      setJobs(mockJobs);

      try {
        // Attempt to fetch real data
        const [fetchedArticles, fetchedResources, fetchedJobs] = await Promise.allSettled([
          supabaseService.getArticles(),
          supabaseService.getResources(),
          supabaseService.getJobs()
        ]);

        if (fetchedArticles.status === 'fulfilled' && fetchedArticles.value.length > 0) {
          setArticles(fetchedArticles.value);
        }
        if (fetchedResources.status === 'fulfilled' && fetchedResources.value.length > 0) {
          setResources(fetchedResources.value);
        }
        if (fetchedJobs.status === 'fulfilled' && fetchedJobs.value.length > 0) {
          setJobs(fetchedJobs.value);
        }
      } catch (error) {
        // Error fetching real data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter(a => articleFilter === 'All' || a.category === articleFilter);
  const filteredResources = resources.filter(r => resourceFilter === 'All' || r.category === resourceFilter);
  const filteredJobs = jobs.filter(j => {
    if (jobFilter === 'All') return true;
    if (jobFilter === 'Remote') return j.location.toLowerCase() === 'remote' || j.type === 'Remote';
    return j.type === jobFilter;
  });

  const articleCategories = ['All', ...new Set(articles.map(a => a.category))];
  const resourceCategories = ['All', ...new Set(resources.map(r => r.category))];
  const jobTypes = ['All', 'Full-time', 'Contract', 'Freelance', 'Remote'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
          >
            The <span className="text-indigo-600">Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Your daily dose of design inspiration, curated resources, and career opportunities. Stay ahead of the curve with the community.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-4 no-scrollbar">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 flex space-x-2 min-w-max">
            {(['articles', 'resources', 'jobs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {activeTab === 'articles' && articleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setArticleFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  articleFilter === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
            {activeTab === 'resources' && resourceCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setResourceFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  resourceFilter === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
            {activeTab === 'jobs' && jobTypes.map(type => (
              <button
                key={type}
                onClick={() => setJobFilter(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  jobFilter === type
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'articles' && (
              <motion.div 
                key="articles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {filteredArticles.map((article) => (
                  <div key={article.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {article.readTime} Read
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                        <InteractionButtons 
                          likes={article.likes} 
                          comments={article.commentsCount} 
                        />
                        <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center">
                          Read More
                          <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div 
                key="resources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{resource.category}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{resource.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">{resource.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {resource.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <InteractionButtons 
                        likes={resource.likes} 
                        comments={resource.commentsCount} 
                      />
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all flex items-center justify-center"
                    >
                      Visit Resource
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                    </a>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div 
                key="jobs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-6 w-full md:w-auto">
                      <img src={job.logo} className="w-16 h-16 rounded-2xl shadow-sm" alt={job.company} />
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{job.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm font-bold text-indigo-600">{job.company}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-sm font-medium text-slate-400 flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1.5 text-[10px]" />
                            {job.location}
                          </span>
                        </div>
                        <div className="mt-3">
                          <InteractionButtons 
                            likes={job.likes} 
                            comments={job.commentsCount} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{job.salary}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.type}</span>
                      </div>
                      <a 
                        href={job.url}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Newsletter Section */}
        <div className="mt-32 bg-slate-900 dark:bg-white rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-4xl md:text-5xl font-black text-white dark:text-slate-900 mb-6 relative z-10 leading-tight">Stay in the loop.</h2>
          <p className="text-slate-400 dark:text-slate-500 text-lg font-medium mb-12 relative z-10 max-w-xl mx-auto">
            Get the best design resources, job alerts, and articles delivered to your inbox every Monday.
          </p>
          <form className="relative z-10 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-grow bg-white/10 dark:bg-slate-100 border border-white/10 dark:border-slate-200 text-white dark:text-slate-900 px-8 py-5 rounded-3xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TheHub;
