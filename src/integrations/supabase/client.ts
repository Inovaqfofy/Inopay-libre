import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "http://209.46.125.157:8000", 
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Njc3MzQ0MCwiZXhwIjo0OTIyNDQ3MDQwLCJyb2xlIjoiYW5vbiJ9.WKI-A1FOGwPB9T1rwM9KWfNtl1cVoxgg6JDaWX8v-u8",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  }
);
