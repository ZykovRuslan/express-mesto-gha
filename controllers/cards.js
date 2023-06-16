const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: Object.values(err.errors).map((error) => error.message).join(', '),
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => res.status(200).send(removedCard));
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const likeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
          { new: true },
        )
          .then((removedCard) => res.status(200).send(removedCard));
      }
    })
    .catch(() => {
      res.status(400).send({ message: `Карточка с указанным id: ${cardId} не существует в базе данных.` });
    });
};

const dislikeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с указанным id: ${cardId} не найдена.` });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } }, // убрать _id из массива
          { new: true },
        )
          .then((removedCard) => res.status(200).send(removedCard));
      }
    })
    .catch(() => {
      res.status(400).send({ message: `Карточка с указанным id: ${cardId} не существует в базе данных.` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCardById,
  dislikeCardById,
};
