const http = require('http');

const data = JSON.stringify({
  question: "Is Flight AI102 safe to operate?"
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/assistant/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log("STATUS:", res.statusCode);
      console.log("RESPONSE:\n", parsed.response);
    } catch (err) {
      console.log("RAW BODY:", body);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
