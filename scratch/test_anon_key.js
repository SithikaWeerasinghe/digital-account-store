const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Read env variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = val;
      } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        supabaseAnonKey = val;
      }
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnon() {
  // Products
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('*');
  console.log(`Fetched ${products ? products.length : 0} products using anon key. (Error: ${pError ? pError.message : 'none'})`);

  // Reviews
  const { data: reviews, error: rError } = await supabase
    .from('reviews')
    .select('*');
  console.log(`Fetched ${reviews ? reviews.length : 0} reviews using anon key. (Error: ${rError ? rError.message : 'none'})`);
}

testAnon();
