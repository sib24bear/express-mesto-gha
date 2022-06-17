const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Проблема с сервером' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      res.status(200).send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Проблема с сервером' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (!err) {
        return res.status(200).send({ data: card });
      }
      if (!card && err.path === '_id') {
        return res.status(404).send({ message: 'Передан некорректный id карточки' });
      }
      if (!card && err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(500).send({ message: 'Проблема с сервером' });
    },
  );
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (!err) {
        return res.status(200).send({ data: card });
      }
      if (!card && err.path === '_id') {
        return res.status(404).send({ message: 'Передан некорректный id карточки' });
      }
      if (!card && err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(500).send({ message: 'Проблема с сервером' });
    },
  );
};
