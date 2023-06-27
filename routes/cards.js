const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCardById,
  dislikeCardById,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  deleteCardById,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().regex(/https?:\/\/(www.)?[\da-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  likeCardById,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  dislikeCardById,
);

module.exports = router;
