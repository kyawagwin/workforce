const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const mongoDbURI = require('./config/keys').mongoDbURI;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(mongoDbURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));