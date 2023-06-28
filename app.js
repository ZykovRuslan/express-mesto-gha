const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const handleError = require('./middlewares/handleError');

const { PORT = 3000 } = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(express.json());

// роуты, не требующие авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(20),
      avatar: Joi.string().regex(/https?:\/\/(www)?[\da-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(routes);
app.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
