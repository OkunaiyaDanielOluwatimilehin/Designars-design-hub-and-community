import { supabase } from '../lib/supabase';
import { DesignBrief, Submission, User, Article, Resource, Job } from '../types';

export const supabaseService = {
  // Challenges
  async getChallenges(): Promise<DesignBrief[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addChallenge(challenge: Omit<DesignBrief, 'id'>): Promise<DesignBrief> {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateChallenge(id: string, updates: Partial<DesignBrief>): Promise<DesignBrief> {
    const { data, error } = await supabase
      .from('challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteChallenge(id: string): Promise<void> {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Submissions
  async getSubmissions(): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addSubmission(submission: Omit<Submission, 'id'>): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSubmissionStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Users / Profiles
  async getProfile(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRankings(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data || [];
  },

  async getAppStats() {
    const results = await Promise.allSettled([
      supabase.from('challenges').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('points')
    ]);

    const challengesCount = results[0].status === 'fulfilled' ? results[0].value.count : 0;
    const profilesCount = results[1].status === 'fulfilled' ? results[1].value.count : 0;
    const submissionsCount = results[2].status === 'fulfilled' ? results[2].value.count : 0;
    const pointsData = results[3].status === 'fulfilled' ? results[3].value.data : [];

    const totalPoints = pointsData?.reduce((acc: number, curr: any) => acc + (curr.points || 0), 0) || 0;

    return {
      challenges: challengesCount || 0,
      members: profilesCount || 0,
      submissions: submissionsCount || 0,
      points: totalPoints
    };
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Resources
  async getResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addResource(resource: Omit<Resource, 'id'>): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Jobs
  async getJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addJob(job: Omit<Job, 'id'>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteJob(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
