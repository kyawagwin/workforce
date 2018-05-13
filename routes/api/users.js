const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const keys = require('../../config/keys');

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

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if(!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if(!isMatch) {
        return res.status(400).json({ message: 'Password incorrect.' });
      }

      const payload = { id: user.id, name: user.name, avatar: user.avatar };

      jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
        if(err) {
          return res.status(500).json({ message: 'jsonwebtoken sign error.' });
        }

        return res.status(200).json({
          message: 'successful',
          token: `Bearer ${token}`
        });
      })
      //return res.status(200).json({ message: 'Successfully login.' });
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ message: 'Password compare issue.' });
    });
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ message: 'Find user by email error.' });
  });
});

module.exports = router;