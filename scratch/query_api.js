const http = require('http');

function queryEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          console.log(`Query ${path} -> Status: ${res.statusCode}, count: ${parsed.data ? parsed.data.length : 'none'}`);
          if (parsed.data && parsed.data.length > 0) {
            console.log('Sample:', parsed.data[0]);
          }
          resolve(parsed);
        } catch (e) {
          console.log(`Query ${path} -> Error: ${e.message}`);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`Query ${path} -> Request Error: ${e.message}`);
      resolve(null);
    });

    req.end();
  });
}

async function run() {
  await queryEndpoint('/api/reviews');
  await queryEndpoint('/api/reviews?type=website');
  await queryEndpoint('/api/reviews?productId=b2b9d0c4-5ec3-4987-9a4c-e67f830b9452');
}

run();
