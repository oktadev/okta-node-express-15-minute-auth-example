const okta = require('@okta/okta-sdk-nodejs');
const express = require('express');

const router = express.Router();

const client = new okta.Client({
  orgUrl: process.env.OKTA_ORG_URL,
  token: process.env.OKTA_TOKEN
});

// Take the user to the homepage if they're already logged in
router.use('/', (req, res, next) => {
  if (req.userContext) {
    return res.redirect('/');
  }

  next();
});

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' }
];

router.get('/', (req, res) => {
  res.render('register', { fields });
});

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    await client.createUser({
      profile: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        login: body.email
      },
      credentials: {
        password: {
          value: body.password
        }
      }
    });

    res.redirect('/');
  } catch ({ errorCauses }) {
    const errors = {};

    errorCauses.forEach(({ errorSummary }) => {
      const [, field, error] = /^(.+?): (.+)$/.exec(errorSummary);
      errors[field] = error;
    });

    res.render('register', {
      errors,
      fields: fields.map(field => ({
        ...field,
        error: errors[field.name],
        value: body[field.name]
      }))
    });
  }
});

module.exports = router;