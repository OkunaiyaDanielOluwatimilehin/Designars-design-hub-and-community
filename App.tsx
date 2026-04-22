
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import BriefDetail from './pages/BriefDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import AiGenerator from './pages/AiGenerator';
import AdminDashboard from './pages/AdminDashboard';
import TheHub from './pages/TheHub';
import { User, DesignBrief, Submission, Article, Resource, Job } from './types';
import { supabase } from './lib/supabase';
import { supabaseService } from './services/supabaseService';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Global Challenge State
  const [allChallenges, setAllChallenges] = useState<DesignBrief[]>([
    {
      id: '1',
      title: 'Eco-Friendly E-commerce App',
      description: 'Design a mobile shopping experience for sustainable products with a focus on carbon footprint transparency.',
      category: 'Mobile App',
      difficulty: 'Intermediate' as any,
      points: 450,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      likes: 124,
      commentsCount: 18,
      deliverables: ['User Flow', 'High-Fidelity Wireframes', 'Interactive Prototype'],
      tools: ['Figma', 'Protopie'],
      summary: 'A deep dive into sustainable UX patterns.'
    },
    {
      id: '2',
      title: 'Cyberpunk Dashboard',
      description: 'Create a futuristic data visualization dashboard for a space station management system.',
      category: 'UI Design',
      difficulty: 'Advanced' as any,
      points: 600,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      likes: 89,
      commentsCount: 12,
      deliverables: ['Dashboard UI', 'Custom Icon Set', 'Style Guide'],
      tools: ['Figma', 'After Effects'],
      summary: 'Exploring high-contrast, data-heavy interfaces.'
    },
    {
      id: '3',
      title: 'Minimalist Portfolio',
      description: 'Design a clean, typography-focused portfolio for a creative director.',
      category: 'Web Design',
      difficulty: 'Beginner' as any,
      points: 300,
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      likes: 56,
      commentsCount: 5,
      deliverables: ['Landing Page', 'Case Study Template', 'Mobile View'],
      tools: ['Figma', 'Framer'],
      summary: 'Focusing on white space and typography.'
    }
  ]);

  // Global Submissions State
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

  // Hub Content State
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await supabaseService.getProfile(session.user.id);
          setCurrentUser(profile);
        } catch (error) {
          console.warn('Error fetching user profile:', error);
          // Fallback user if profile fetch fails
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 'User',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            points: 0,
            challengesCompleted: 0,
            rank: 0,
            skills: [],
            joinedDate: new Date().toISOString(),
            notifications: true,
            isPublic: true
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Initial Data Fetch
    const fetchData = async () => {
      console.log('Starting initial data fetch from Supabase...');
      try {
        // Test connection first
        const { error: testError } = await supabase.from('challenges').select('id').limit(1);
        if (testError) {
          console.error('Supabase Connection Test Failed:', testError);
          if (testError.message === 'Failed to fetch') {
            setSupabaseError('Supabase project unreachable. Please check your URL in Settings.');
          } else {
            setSupabaseError(testError.message);
          }
        } else {
          console.log('Supabase Connection Test Successful');
          setSupabaseError(null);
        }

        const results = await Promise.allSettled([
          supabaseService.getChallenges(),
          supabaseService.getSubmissions(),
          supabaseService.getArticles(),
          supabaseService.getResources(),
          supabaseService.getJobs()
        ]);

        const allRejected = results.every(r => r.status === 'rejected');
        const someRejected = results.some(r => r.status === 'rejected');

        if (results[0].status === 'fulfilled' && results[0].value.length > 0) setAllChallenges(results[0].value);
        if (results[1].status === 'fulfilled') setAllSubmissions(results[1].value);
        if (results[2].status === 'fulfilled') setAllArticles(results[2].value);
        if (results[3].status === 'fulfilled') setAllResources(results[3].value);
        if (results[4].status === 'fulfilled') setAllJobs(results[4].value);
        
        if (someRejected) {
          // Some data failed to fetch
        }
      } catch (error: any) {
        console.warn('Unexpected error during initial data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const handleAddChallenge = async (newBrief: Omit<DesignBrief, 'id'>) => {
    try {
      const added = await supabaseService.addChallenge({ ...newBrief, isPublished: true });
      setAllChallenges(prev => [...prev, added]);
    } catch (error) {
      console.error('Error adding challenge:', error);
    }
  };

  const handleUpdateChallenge = async (updatedBrief: DesignBrief) => {
    try {
      const updated = await supabaseService.updateChallenge(updatedBrief.id, updatedBrief);
      setAllChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    try {
      await supabaseService.deleteChallenge(id);
      setAllChallenges(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await supabaseService.updateSubmissionStatus(id, status);
      setAllSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  // Hub Handlers
  const handleAddArticle = async (article: Omit<Article, 'id'>) => {
    try {
      const added = await supabaseService.addArticle(article);
      setAllArticles(prev => [added, ...prev]);
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await supabaseService.deleteArticle(id);
      setAllArticles(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleAddResource = async (resource: Omit<Resource, 'id'>) => {
    try {
      const added = await supabaseService.addResource(resource);
      setAllResources(prev => [added, ...prev]);
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await supabaseService.deleteResource(id);
      setAllResources(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleAddJob = async (job: Omit<Job, 'id'>) => {
    try {
      const added = await supabaseService.addJob(job);
      setAllJobs(prev => [added, ...prev]);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await supabaseService.deleteJob(id);
      setAllJobs(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
        {supabaseError && (
          <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-bold animate-pulse z-50">
            ⚠️ {supabaseError} (Check Settings &gt; Environment Variables)
          </div>
        )}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home challenges={allChallenges.filter(c => c.isPublished)} />} />
            <Route path="/challenges" element={<Challenges challenges={allChallenges.filter(c => c.isPublished)} />} />
            <Route path="/hub" element={<TheHub />} />
            <Route path="/generator" element={<AiGenerator onAddChallenge={handleAddChallenge} />} />
            <Route path="/challenge/:id" element={<BriefDetail challenges={allChallenges} currentUser={currentUser} />} />
            <Route path="/profile/:id" element={<Profile currentUser={currentUser} />} />
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup onSignup={handleLogin} />} />
            <Route path="/settings" element={currentUser ? <Settings currentUser={currentUser} onUpdateUser={handleLogin} /> : <Navigate to="/login" />} />
            
            <Route 
              path="/admin" 
              element={
                (currentUser?.role === 'backend-developer' || currentUser?.role === 'admin' || currentUser?.email === 'okunaiyadaniel13@gmail.com')
                  ? <AdminDashboard 
                      onAddChallenge={handleAddChallenge} 
                      onUpdateChallenge={handleUpdateChallenge}
                      onDeleteChallenge={handleDeleteChallenge}
                      challenges={allChallenges} 
                      submissions={allSubmissions}
                      onUpdateSubmission={handleUpdateSubmissionStatus}
                      articles={allArticles}
                      onAddArticle={handleAddArticle}
                      onDeleteArticle={handleDeleteArticle}
                      resources={allResources}
                      onAddResource={handleAddResource}
                      onDeleteResource={handleDeleteResource}
                      jobs={allJobs}
                      onAddJob={handleAddJob}
                      onDeleteJob={handleDeleteJob}
                    /> 
                  : <Navigate to="/" />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
