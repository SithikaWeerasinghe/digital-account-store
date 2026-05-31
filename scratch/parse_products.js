const fs = require('fs');

const html = fs.readFileSync('scratch/final_page.html', 'utf8');

// Check if __NEXT_DATA__ is present
const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
if (nextDataMatch) {
  console.log('Found __NEXT_DATA__!');
  const data = JSON.parse(nextDataMatch[1]);
  fs.writeFileSync('scratch/next_data.json', JSON.stringify(data, null, 2));
  console.log('Saved next data JSON to scratch/next_data.json. Keys:', Object.keys(data));
  if (data.props && data.props.pageProps) {
    console.log('pageProps keys:', Object.keys(data.props.pageProps));
  }
} else {
  console.log('__NEXT_DATA__ not found. Let us search for other JSON blocks or text patterns.');
  // Look for any large JSON-like string in script tags
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1];
    if (content.includes('products') || content.includes('shop')) {
      console.log(`Script ${count++} contains "products" or "shop", length: ${content.length}`);
      if (content.length < 2000) {
        console.log('Content snippet:', content.trim().slice(0, 500));
      }
    }
  }
}
