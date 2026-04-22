import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  let url = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  // HOTFIX: If the unreachable project is detected, override with the correct one
  if (url?.includes('tkejvvloufmrhmxasfll')) {
    console.warn('Supabase Hotfix: Overriding unreachable project URL and Key.');
    url = 'https://lfsbumlodtsxutpwyehv.supabase.co';
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc2J1bWxvZHRzeHV0cHd5ZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDgwOTEsImV4cCI6MjA5MTQ4NDA5MX0.oNgYCThuYD_aZEVW4A-_LCtDRrDHzRugi83YhStRvDg';
  }

  return { url, key };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

if (import.meta.env.DEV) {
  console.log('Supabase Configuration Check:');
  console.log('- URL:', supabaseUrl || 'MISSING');
  console.log('- Anon Key:', supabaseAnonKey ? 'Present (starts with ' + supabaseAnonKey.substring(0, 10) + '...)' : 'MISSING');
  
  if (import.meta.env.VITE_SUPABASE_URL?.includes('tkejvvloufmrhmxasfll')) {
    console.info('Note: Your platform settings still point to the unreachable project. I have applied a code-level override.');
  }

  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    console.error('CRITICAL: Supabase URL must start with https://');
  }
}

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
