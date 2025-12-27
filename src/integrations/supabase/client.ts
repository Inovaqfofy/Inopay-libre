import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Cette partie intercepte les appels aux Edge Functions pour les rediriger vers le bon port
    fetch: (url, options) => {
      let finalUrl = url.toString();
      if (finalUrl.includes('/functions/v1/')) {
        // On remplace le domaine API par l'IP directe et le port 8000 (Kong)
        // Note: Assurez-vous que le port 8000 est ouvert sur votre VPS
        finalUrl = finalUrl.replace('http://api.209.46.125.157.sslip.io', 'http://209.46.125.157:8000');
        console.log("Redirecting Edge Function call to:", finalUrl);
      }
      return fetch(finalUrl, options);
    }
  }
});
