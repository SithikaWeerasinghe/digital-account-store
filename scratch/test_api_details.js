const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log('API SUCCESS:', parsed.success);
      if (parsed.success && parsed.data) {
        console.log('PRODUCTS COUNT:', parsed.data.length);
        if (parsed.data.length > 0) {
          console.log('FIRST PRODUCT:', JSON.stringify(parsed.data[0], null, 2));
        }
      } else {
        console.log('API ERROR MESSAGE:', parsed.message);
      }
    } catch (e) {
      console.error('FAILED TO PARSE JSON:', e.message);
      console.log('BODY HEAD:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error(`Request problem: ${e.message}`);
});

req.end();
