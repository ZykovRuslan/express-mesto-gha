const http2 = require('http2');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(http2.constants.HTTP_STATUS_OK).send(users))
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Получение пользователя с некорректным id: ${userId}` });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  User.create(newUserData)
    .then((newUser) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Пожалуйста, проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message.slice(5)}`).join(' ')}`,
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `Пожалуйста, проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message.slice(5)}`).join(' ')}`,
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const updateAvatarById = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
};
