const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Users works!' }));

router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if(user) {
      console.log(err);
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'x',
      d: 'retro'
    }, false);

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return req.status(500).json({ message: 'Salt generate error.' });
      }

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if(err) {
          console.log(err);
          return req.status(500).json({ message: 'Password hash error.' });
        }

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: hash
        });

        newUser.save().then(user => res.json(user)).catch(err => {
          console.log(err);
          return res.status(500).json({ message: 'User save error.' });
        });
      });
    });
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({ message: 'Find user by email error.' })
  });
});

module.exports = router;