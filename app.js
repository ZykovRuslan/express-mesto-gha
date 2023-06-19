const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const routes = require('./routes');

const { PORT = 3000 } = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648bf3c0c3ba4347d7bedf83',
  };

  next();
});

app.use(routes);

app.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
