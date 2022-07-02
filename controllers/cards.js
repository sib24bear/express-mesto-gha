const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.id })
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (cards.owner.toString() !== req.user.id) {
        res.status(403).send({ message: 'Нет прав для удаления этой карточки.' });
      }
      if (!cards) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      res.status(200).send({ data: cards });
    })
    .catch(next);
};
