import { constants as http2Constants } from 'node:http2';
import mongoose from 'mongoose';
import User from '../models/user.js';

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

export const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(http2Constants.HTTP_STATUS_OK).send(allUsers);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = req.body;
    const user = await User.create(newUser);
    res.status(http2Constants.HTTP_STATUS_CREATED).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res, varibles) => {
  try {
    const newData = {};
    varibles.forEach((item) => {
      newData[item] = req.body[item];
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
    }).orFail();
    res.status(http2Constants.HTTP_STATUS_OK).send(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUser = async (req, res) => {
  await updateData(req, res, ['name', 'about']);
};

export const updateAvatar = async (req, res) => {
  await updateData(req, res, ['avatar']);
};
