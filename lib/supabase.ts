import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  let url = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  return { url, key };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      const errorMsg = 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables or .env file.';
      console.error(errorMsg);
      // We return a dummy client that throws on use to avoid breaking the app during init
      return createClient('https://placeholder.supabase.co', 'placeholder');
    }
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return createClient('https://placeholder.supabase.co', 'placeholder');
    }
  }
  return supabaseInstance;
};

// Export a proxy to maintain the existing API while allowing lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const instance = getSupabase();
    return (instance as any)[prop];
  }
});
