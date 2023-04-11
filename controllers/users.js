const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { ValidationError, CastError } = mongoose.Error;
const { SUCCESS_CREATED, DUPLICATE_OBJECT } = require('../utils/response-status'); // 201 и 11000
// Классы ошибок
const NotFound = require('../utils/response-errors/NotFound'); // 404
const BadRequests = require('../utils/response-errors/BadRequest'); // 400
const ConflictingRequest = require('../utils/response-errors/ConflictingRequest'); // 409
// Функция авторизации пользователя
const authorizeUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((userItem) => {
      const token = jwt.sign({ _id: userItem._id }, NODE_ENV === 'production' ? JWT_SECRET : 'diploma-secret', { expiresIn: '7d' });
      return res.cookie('jwt', token, { maxAge: 3600000 * 168, sameSite: true, httpOnly: true }).send({ token });
    })
    .catch(next);
};
// Функция выхода пользователя
const logoutUser = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход из системы выполнен успешно' });
};
// Функция регистрации пользователя
const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash) => userModel.create({ name, email, password: hash }))
    .then((userItem) => res.status(SUCCESS_CREATED).send({
      name: userItem.name,
      email: userItem.email,
    }))
    .catch((error) => {
      // https://mongoosejs.com/docs/api/error.html#error_Error-ValidationError
      if (error instanceof ValidationError) next(new BadRequests('Переданы некорректные данные при регистрации пользователя'));
      else if (error.code === DUPLICATE_OBJECT) next(new ConflictingRequest('Пользователь с указанными данными уже есть в системе'));
      else next(error);
    });
};
// Функция получения пользователя по ID
const getUserId = (req, res, next) => {
  userModel.findById(req.user._id)
    .orFail(() => next(new NotFound('Пользователь по указанному ID не найден')))
    .then((userItem) => res.send(userItem))
    .catch((error) => {
      // https://mongoosejs.com/docs/api/error.html#error_Error-CastError
      if (error instanceof CastError) next(new BadRequests('Некорректные данные запрашиваемого пользователя'));
      else next(error);
    });
};
// Функция обновления данных пользователя
const updateUserData = (req, res, next) => {
  const { name, email } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => next(new NotFound('Пользователь по указанному ID не найден')))
    .then((userItem) => res.send(userItem))
    .catch((error) => {
      // https://mongoosejs.com/docs/api/error.html#error_Error-ValidationError
      if (error instanceof ValidationError) next(new BadRequests('Переданы некорректные данные при обновлении пользователя'));
      else next(error);
    });
};

module.exports = {
  authorizeUser, logoutUser, registerUser, getUserId, updateUserData,
};
