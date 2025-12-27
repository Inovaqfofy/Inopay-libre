import { createClient } from '@supabase/supabase-js';

// En utilisant l'IP directe et le port, on évite la redirection 302 du domaine api.
const SUPABASE_URL = "http://209.46.125.157:8000";
const SUPABASE_ANON_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Njc3MzQ0MCwiZXhwIjo0OTIyNDQ3MDQwLCJyb2xlIjoiYW5vbiJ9.WKI-A1FOGwPB9T1rwM9KWfNtl1cVoxgg6JDaWX8v-u8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // TRÈS IMPORTANT : On force l'URL pour éviter les redirections 302
    flowType: 'pkce', 
    detectSessionInUrl: false
  }
});
