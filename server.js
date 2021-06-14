const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/', (req, res) => {
  // const param = req.query.param;

  res.json({ 'Hello': 'World!' });
});

app.get('/landing', (req, res) => {
  const codeParam = req.query.code;

  const code = codeParam.slice(0, -2);

  console.log(`Received code ${code}`);

  exchangeBody = {
    client_id: '469218404399973',
    client_secret: '50976c32493171dfd63e20358bfeaed9',
    grant_type: 'authorization_code',
    redirect_uri: 'https://zglimbeld.github.io/test-dc/',
    code: code
  }

  console.log(JSON.stringify(exchangeBody));

  fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify(exchangeBody),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => console.log(json));
});

const port = process.env.PORT || 8080


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
