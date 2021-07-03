const express = require('express');
const fetch = require('node-fetch');
const { createUser, findUser, addToken, findToken, getAppData } = require('./database.js');

const app = express();

const loadAppData = async () => {
  const app_data = await getAppData();
  [app_id, app_secret] = app_data[0];
  
  return [app_id, app_secret];
}

app.get('/', (req, res) => {
  const user_id = req.query.user;
  if (!user_id) {
    res.status(403).json('Please specify a user!');
  }
  else {
    loadAppData()
    .then(data => {
      const app_id = data[0];
      res.redirect(`https://api.instagram.com/oauth/authorize?client_id=${app_id}&redirect_uri=https://digitalcompass.azurewebsites.net/landing&scope=user_profile,user_media&response_type=code&state=${user_id}`);
    });
  }
});

app.get('/landing', (req, res) => {
  const code_param = req.query.code;
  const user_id = req.query.state;
  if (!code_param || !user_id) {
    res.status(400).json('Something went wrong!');
  }
  else {
    const code = code_param.slice(0, -2);
    console.log(`Received code ${code}`);

    exchangeBody = {
      client_id: app_id,
      client_secret: app_secret,
      grant_type: 'authorization_code',
      redirect_uri: 'https://digitalcompass.azurewebsites.net/landing',
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
      loadAppData()
      .then(data => {
        const app_secret = data[1];
        fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${app_secret}&access_token=${access_token}`, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          const access_token = json.access_token;
          addToken(user_id, access_token)
          .then(() => {
            res.status(201).json('Successfully saved access token!');
          });
        });
      });
    });
  }
});

app.get('/media', (req, res) => {
  const user_id = req.query.user;
  if (!user_id) {
    res.status(403).json('Please specify a user!');
  }
  else {
    findToken(user_id)
    .then(data => {
      console.log(typeof(data));
      if (data.length === 0) {
        console.log('Here we goooo');
        res.redirect(`/?user=${user_id}`)
      }
      else {
        const access_token_data = data[0];
        const access_token = access_token_data[0];
        console.log(access_token);
        fetch(`https://graph.instagram.com/me/media?field=id,caption&access_token=${access_token}`, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(json => res.json(json));
      }
    });
  }
});

const port = process.env.PORT || 8080


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
