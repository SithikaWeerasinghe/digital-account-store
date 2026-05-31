const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFilePath = 'C:\\Users\\HP Elitebook 840 G6\\.gemini\\antigravity\\brain\\6d8381a0-7465-4c17-a267-2b5674942824\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFilePath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      const content = obj.content || '';
      console.log(`--- STEP ${obj.step_index} ---`);
      console.log(content);
    }
  } catch (e) {
    // Ignore parse errors
  }
});
