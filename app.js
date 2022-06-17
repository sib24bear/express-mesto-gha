const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62ab737a3e97a828dc95e10f',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  res.status(500).send({ message: 'Проблема с сервером' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
