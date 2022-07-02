const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const PORT = 3000;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUser);

app.post('/signin', login);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.use(errors());

// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    res.status(409).send({ message: 'Email занят' });
  }
  if (err.statusCode === 401) {
    res.status(401).send({ message: 'Не правильный email или пароль' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  res.status(500).send({ message: 'Проблема с сервером' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
