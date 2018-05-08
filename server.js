const express = require('express');
const mongoose = require('mongoose');

const app = express();
const mongoDbURI = require('./config/keys').mongoDbURI;

mongoose
  .connect(mongoDbURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));