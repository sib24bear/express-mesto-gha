const Card = require('../models/card');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.id })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      if (cards.owner.toString() !== req.user.id) {
        next(new ForbiddenError('Нет прав для удаления этой карточки.'));
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => res.send({ data: card }))
        .catch(next);
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
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ data: cards });
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
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ data: cards });
    })
    .catch(next);
};
