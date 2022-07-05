const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { RegExpURL } = require('../utils/constants');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const paramsValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2).max(30)
        .pattern(RegExpURL),
    }),
  }),
  createCard,
);
router.get('/', getCards);
router.delete('/:cardId', paramsValid, deleteCard);
router.put('/:cardId/likes', paramsValid, likeCard);
router.delete('/:cardId/likes', paramsValid, dislikeCard);

module.exports = router;
