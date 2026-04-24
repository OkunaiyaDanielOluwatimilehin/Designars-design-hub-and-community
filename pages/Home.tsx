
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUsers, faMagic, faPalette, faBook, faBriefcase, faPlay, faCheckCircle, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ChallengeCard from '../components/ChallengeCard';
import { DesignBrief } from '../types';
import { supabaseService } from '../services/supabaseService';

interface HomeProps {
  challenges: DesignBrief[];
}

const Home: React.FC<HomeProps> = ({ challenges }) => {
  const previewChallenges = challenges.slice(0, 3);
  const [businessTab, setBusinessTab] = useState<'partner' | 'launch'>('partner');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Form States
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [hiringNeeds, setHiringNeeds] = useState('Looking for UI/UX Designers');
  const [description, setDescription] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [rewardPool, setRewardPool] = useState('$1,000 - $5,000');
  const [duration, setDuration] = useState('14 Days (Standard)');

  const [stats, setStats] = useState({
    challenges: 42,
    members: 12400,
    submissions: 8900
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await supabaseService.getAppStats();
        if (data) setStats(data);
      } catch (error) {
        console.warn('Error fetching stats, using defaults:', error);
      }
    };
    fetchStats();
  }, []);

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID;
    
    if (!formId) {
      console.error('Formspree Form ID is missing');
      // Fallback for demo if no ID is set
      setTimeout(() => {
        setIsSubmitting(false);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 5000);
      }, 1000);
      return;
    }

    const formData = {
      formType: businessTab === 'partner' ? 'Partnership Request' : 'Challenge Launch',
      companyName,
      contactEmail,
      ...(businessTab === 'partner' 
        ? { hiringNeeds, description } 
        : { challengeGoal, rewardPool, duration }
      )
    };

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormSubmitted(true);
        // Reset form
        setCompanyName('');
        setContactEmail('');
        setDescription('');
        setChallengeGoal('');
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setFormError('Failed to send request. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-12 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 -z-10 w-full h-full opacity-20 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-400 blur-[100px] rounded-full opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Join our growing community of designers
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9] mb-8">
                Designa-rs <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 text-5xl md:text-7xl">The Designer's Hub <br className="hidden md:block" />& Arena.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                The ultimate destination for designers to master their craft. Access high-fidelity briefs, curated resources, and a global job board. Build a world-class portfolio with the community that powers the next generation of design.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link to="/challenges" className="group relative bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-5 rounded-3xl font-black text-lg hover:-translate-y-1 transition-all shadow-2xl shadow-slate-200 dark:shadow-indigo-900/20 flex items-center justify-center">
                  <span>Start a Brief</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" alt="UI" />
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="text-3xl font-black mb-1">98%</div>
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Skill Growth</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl mb-4 flex items-center justify-center text-emerald-600">
                      <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                    </div>
                    <div className="font-black text-slate-900 dark:text-white">Collaborative</div>
                    <div className="text-slate-400 text-[10px] mt-1">Review peers & grow together.</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" alt="Motion" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section / Counter */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { label: 'Briefs Available', value: stats.challenges },
              { label: 'Active Members', value: stats.members },
              { label: 'Submissions', value: stats.submissions }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Preview Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">The Challenge Arena.</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Fresh briefs designed to push your limits. Build portfolio-ready work and ship faster.</p>
            </div>
            <Link to="/challenges" className="hidden md:flex items-center space-x-2 text-indigo-600 font-black text-sm uppercase tracking-widest group">
              <span>View All Briefs</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {previewChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
          
          <div className="text-center md:hidden">
            <Link to="/challenges" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">
              Explore Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Elite Features for Elite Designers</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Everything you need to go from hobbyist to high-earning professional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: faPalette, title: 'Curated Briefs', text: 'Real-world requirements designed to build a professional-grade portfolio.' },
              { icon: faBook, title: 'Resource Hub', text: 'Handpicked tools, assets, and learning materials for every design discipline.' },
              { icon: faBriefcase, title: 'Job Board', text: 'Connect with top studios and find your next career-defining role.' },
              { icon: faUsers, title: 'Community Review', text: 'Get constructive feedback from peers and industry experts on your work.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <FontAwesomeIcon icon={feature.icon} className="text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section (Replaces Price Section) */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-16">
            <div className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">Inside the Arena</div>
            <h2 className="text-5xl font-black text-white mb-4">See Designa-rs in Action</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">Take a tour of the world's most immersive design challenge platform.</p>
          </div>
          
          {/* Video Container */}
          <div className="max-w-5xl mx-auto aspect-video bg-slate-800 rounded-[3rem] border border-slate-700 shadow-2xl overflow-hidden relative group cursor-pointer">
            <video 
              className="w-full h-full object-cover opacity-80"
              poster="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200"
              muted
              loop
              autoPlay
              playsInline
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-9061-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-100 group-hover:bg-slate-900/20 transition-all">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform shadow-2xl">
                <FontAwesomeIcon icon={faPlay} className="text-3xl ml-1" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-left">
              <div>
                <p className="text-white font-black text-2xl mb-1">Interactive Case Studies</p>
                <p className="text-slate-300 text-sm font-medium">Learn how to build portfolio-winning solutions.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase text-white tracking-widest">
                4:20 Full Tour
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8">Four steps to <span className="text-indigo-600">Designer Mastery</span></h2>
              <div className="space-y-10">
                {[
                  { n: '01', t: 'Select a Brief', d: 'Choose from UI/UX, Branding, Logo, or Motion challenges categorized by difficulty.' },
                  { n: '02', t: 'Download Brief', d: 'Get the full requirements document with deliverables and recommended tools.' },
                  { n: '03', t: 'Build & Polish', d: 'Use your favorite tools to bring the brief to life and build your portfolio.' },
                  { n: '04', t: 'Level Up', d: 'Master your craft and prepare for world-class design roles.' }
                ].map((step, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <span className="text-3xl font-black text-indigo-600/30 dark:text-indigo-400/20">{step.n}</span>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.t}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative bg-white dark:bg-slate-900 p-4 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" className="rounded-[2.5rem]" alt="Working" />
                <div className="absolute -bottom-8 -left-8 bg-indigo-600 text-white p-8 rounded-3xl shadow-xl animate-bounce">
                  <div className="text-xs uppercase font-black tracking-widest mb-1">Status</div>
                  <div className="font-black">Brief Downloaded! 📄</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Resources Section */}
      <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-[4rem] p-12 md:p-20 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                  More than just <span className="text-indigo-400">Briefs.</span>
                </h2>
                <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed">
                  Join a thriving community of designers. Access curated resources, stay updated with the latest design news, and find your next career move in our job board.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-12">
                  {[
                    { label: 'Design Articles', icon: faBook },
                    { icon: faPalette, label: 'Resource Hub' },
                    { icon: faBriefcase, label: 'Job Board' },
                    { label: 'Latest News', icon: faMagic }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <FontAwesomeIcon icon={item.icon} className="text-indigo-400 text-xl" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/hub" 
                  className="inline-block bg-white text-slate-900 px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-2xl"
                >
                  Explore The Hub
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-[4/5] bg-indigo-600 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60" alt="Design" />
                  </div>
                  <div className="aspect-square bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/10 p-8 flex flex-col justify-end">
                    <p className="text-white font-black text-xl">Curated Tools</p>
                    <p className="text-slate-400 text-sm">Handpicked for you.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/10 p-8 flex flex-col justify-end">
                    <p className="text-white font-black text-xl">Job Alerts</p>
                    <p className="text-slate-400 text-sm">Top studios hiring.</p>
                  </div>
                  <div className="aspect-[4/5] bg-purple-600 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60" alt="Creative" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-16 text-center">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I use the briefs?', a: 'Simply download the brief document which contains all requirements, deliverables, and recommended tools. Use it to build a real-world project for your portfolio.' },
              { q: 'Can I use my work in my personal portfolio?', a: 'Absolutely! You retain all IP rights to your work. These briefs are designed to help you build a world-class portfolio.' },
              { q: 'Is there a limit to how many briefs I can download?', a: 'None at all. You can tackle as many as you like. We recommend one deep-dive brief per week.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50 dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 cursor-pointer">
                <summary className="flex justify-between items-center font-black text-slate-900 dark:text-white list-none">
                  {faq.q}
                  <span className="text-indigo-600 group-open:rotate-180 transition-transform">
                    <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5" />
                  </span>
                </summary>
                <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-12 tracking-tighter">Ready to <span className="text-indigo-600">Level Up?</span></h2>
          <Link to="/signup" className="inline-flex bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all">
            Join the Arena Today
          </Link>
          <div className="mt-12 flex items-center justify-center space-x-4">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=final${i}`} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 shadow-xl" alt="Designer"/>)}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs">Join our growing community of world-class designers</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
