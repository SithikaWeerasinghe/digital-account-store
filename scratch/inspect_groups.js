const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('scratch/parsed_products.json', 'utf8'));

const keywords = ['Canva', 'Perplexity', 'Claude', 'Grok', 'Dazn', 'ChatGPT', 'Boosts', 'Prime', 'YouTube'];

keywords.forEach(kw => {
  console.log(`\n--- Matches for ${kw} ---`);
  rawProducts.forEach(p => {
    if (p.name.toLowerCase().includes(kw.toLowerCase())) {
      console.log(`ID: ${p.id}, Name: "${p.name}", Slug: "${p.slug}", Price: ${p.price}`);
    }
  });
});
