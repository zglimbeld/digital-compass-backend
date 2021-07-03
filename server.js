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
  res.status(200).json('Hello and welcome to Digital Compass!');
});

app.get('/auth-ig', (req, res) => {
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
  const code = req.query.code;
  const user_id_param = req.query.state;
  if (!code || !user_id_param) {
    res.status(400).json('Something went wrong!');
  }
  else {
    const user_id = user_id_param.slice(0, -2);

    loadAppData()
    .then(data => {
      const app_id = data[0];
      const app_secret = data[1];
      const exchangeBody = new FormData();
      exchangeBody.append('client_id', `${app_id}`);
      exchangeBody.append('client_secret', `${app_secret}`);
      exchangeBody.append('grant_type', 'authorization_code');
      exchangeBody.append('redirect_uri', 'https://digitalcompass.azurewebsites.net/landing');
      exchangeBody.append('code', `${code}`);

      fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: exchangeBody,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => res.json())
      .then(json => {
        if (!json.access_token) {
          res.status(400).json(json);
        }
        else {
          const access_token = json.access_token;
          fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${app_secret}&access_token=${access_token}`, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(json => {
            if (!json.access_token) {
              res.status(400).json(json);
            }
            else {
              const access_token = json.access_token;
              addToken(user_id, access_token)
              .then(() => {
                res.status(201).json('Successfully saved access token!');
              });
            }
          });
        }
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
      if (data.length === 0) {
        res.redirect(`/?user=${user_id}`)
      }
      else {
        const access_token_data = data[0];
        const access_token = access_token_data[0];
        fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${access_token}`, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(json => res.json(json));
      }
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
