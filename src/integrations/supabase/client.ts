import { createClient } from '@supabase/supabase-js';

// On utilise l'IP directe pour être certain qu'aucune redirection ne se produit
const SUPABASE_URL = "http://209.46.125.157:8000";
const SUPABASE_ANON_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Njc3MzQ0MCwiZXhwIjo0OTIyNDQ3MDQwLCJyb2xlIjoiYW5vbiJ9.WKI-A1FOGwPB9T1rwM9KWfNtl1cVoxgg6JDaWX8v-u8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
