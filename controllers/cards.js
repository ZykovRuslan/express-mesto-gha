const http2 = require('http2');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(http2.constants.HTTP_STATUS_OK).send(cards))
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: Object.values(err.errors).map((error) => error.message).join(', '),
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch(() => {
            res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
          });
      }
    })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Карточка с указанным id: ${cardId} не существует в базе данных.` });
    });
};

const likeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
          { new: true },
        )
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch(() => {
            res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
          });
      }
    })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Карточка с указанным id: ${cardId} не существует в базе данных.` });
    });
};

const dislikeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } }, // убрать _id из массива
          { new: true },
        )
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch(() => {
            res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
          });
      }
    })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Карточка с указанным id: ${cardId} не существует в базе данных.` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCardById,
  dislikeCardById,
};
