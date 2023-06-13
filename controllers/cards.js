import { constants as http2Constants } from 'node:http2';
import mongoose from 'mongoose';
import Card from '../models/card';

function errorHandler(error, res) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: `${Object.values(error.errors)
        .map((err) => err.message)
        .join(', ')}`,
    });
  }

  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(http2Constants.HTTP_STATUS_NOT_FOUND).send({
      message: 'Запрашиваемая карточка не найдена',
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(http2Constants.HTTP_STATUS_BAD_REQUEST).send({
      message: 'Некорректный id',
    });
  }

  return res
    .status(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Server Error' });
}

export const getCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    res.status(http2Constants.HTTP_STATUS_OK).send(allCards);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send({ message: 'Успешно удалено!' });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();
    res.status(http2Constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    errorHandler(error, res);
  }
};
