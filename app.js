const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { RegExpURL } = require('./utils/constants');
const { NotFoundError } = require('./errors/NotFoundError');

const PORT = 3000;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(RegExpURL),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors());

// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.statusCode === 400) {
    res.status(err.statusCode).send({ message: err.message });
  }
  if (err.statusCode === 401) {
    res.status(err.statusCode).send({ message: err.message });
  }
  if (err.statusCode === 403) {
    res.status(err.statusCode).send({ message: err.message });
  }
  if (err.statusCode === 404) {
    res.status(err.statusCode).send({ message: err.message });
  }
  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    res.status(409).send({ message: 'Email занят' });
  }

  res.status(500).send({ message: 'Проблема с сервером' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
