import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient> | null = null;

async function initSupabase(): Promise<SupabaseClient> {
  const res = await fetch('/api/config');
  const config = await res.json();

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error('Supabase configuration not available');
  }

  supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
  return supabaseInstance;
}

export async function getSupabase(): Promise<SupabaseClient> {
  if (supabaseInstance) return supabaseInstance;
  if (!initPromise) {
    initPromise = initSupabase();
  }
  return initPromise;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!supabaseInstance) {
      throw new Error('Supabase not initialized yet. Use getSupabase() first.');
    }
    return (supabaseInstance as any)[prop];
  },
});
