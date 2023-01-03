const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lvixgdrkzecihyzpessj.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXhnZHJremVjaWh5enBlc3NqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MDg5MjcyMSwiZXhwIjoxOTg2NDY4NzIxfQ.pNaHxKIjFBDbglDvP4U48wWQd3j6Vyb1C7hMipPjORI";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports= client;