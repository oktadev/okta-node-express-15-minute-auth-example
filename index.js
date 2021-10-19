require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

app.use(
  require('express-session')({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

const { ExpressOIDC } = require('@okta/oidc-middleware');
const oidc = new ExpressOIDC({
  appBaseUrl: process.env.HOST_URL,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/callback`,
  scope: 'openid profile',
  routes: {
    loginCallback: {
      path: '/callback'
    }
  }
});

app.use(oidc.router);

app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));
