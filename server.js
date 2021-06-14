const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/', (req, res) => {
  res.redirect(`https://api.instagram.com/oauth/authorize?client_id=469218404399973&redirect_uri=http://digitalcompass.azurewebsites.net/landing&scope=user_profile,user_media&response_type=code`);
});

app.get('/landing', (req, res) => {
  const codeParam = req.query.code;
  const code = codeParam.slice(0, -2);

  console.log(`Received code ${code}`);

  exchangeBody = {
    client_id: '469218404399973',
    client_secret: '50976c32493171dfd63e20358bfeaed9',
    grant_type: 'authorization_code',
    redirect_uri: 'http://digitalcompass.azurewebsites.net/landing',
    code: code
  }

  console.log(JSON.stringify(exchangeBody));

  fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify(exchangeBody),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
    const access_token = json.access_token;
  });
});

app.get('/media', (req, res) => {
  fetch(`https://graph.instagram.com/me/media?field=id,caption&access_token=${access_token}`, {
    method: 'GET'
  })
  .then(res => res.json())
  .then(json => res.json(json))
});

const port = process.env.PORT || 8080


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
