const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Проблема с сервером' }));
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
    (err, user) => {
      if (!err) {
        return res.status(200).send({ data: user });
      }
      if (!user && err.path === '_id') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (!user && err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Проблема с сервером' });
    },
  );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
    (err, user) => {
      if (!err) {
        return res.status(200).send({ data: user });
      }
      if (!user && err.path === '_id') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (!user && err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Проблема с сервером' });
    },
  );
};
