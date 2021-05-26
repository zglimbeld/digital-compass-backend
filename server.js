const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/landing', (req, res) => {
  const codeParam = req.query.code;

  const code = codeParam.slice(0, -2);

  console.log(`Received code ${code}`);

  exchangeBody = {
    client_id: '469218404399973',
    client_secret: '50976c32493171dfd63e20358bfeaed9',
    grant_type: 'authorization_code',
    redirect_uri: 'localhost:8080/landing',
    code: code
  }

  fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify(exchangeBody),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => console.log(json));
});


app.listen(8080, () => {
  console.log('Server running on port 8080');
});
