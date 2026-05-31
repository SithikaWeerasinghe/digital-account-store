const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\HP Elitebook 840 G6\\.gemini\\antigravity\\brain\\6d8381a0-7465-4c17-a267-2b5674942824';
const files = fs.readdirSync(dir);
console.log('Artifacts files:');
files.forEach(f => {
  const stats = fs.statSync(path.join(dir, f));
  if (stats.isFile()) {
    console.log(`- ${f} (${stats.size} bytes)`);
  }
});
