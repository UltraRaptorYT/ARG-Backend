const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lvixgdrkzecihyzpessj.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXhnZHJremVjaWh5enBlc3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4OTI3MjEsImV4cCI6MTk4NjQ2ODcyMX0.o8MGdLzgvOeQCRyL0uFkldN2wwlOBWZtx8SUBY29OlY";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports= client;
