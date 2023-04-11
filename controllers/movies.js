const mongoose = require('mongoose');
const movieModel = require('../models/movie');

const { ValidationError, CastError } = mongoose.Error;
const { SUCCESS_CREATED } = require('../utils/response-status'); // 201
// Классы ошибок
const NotFound = require('../utils/response-errors/NotFound'); // 404
const BadRequests = require('../utils/response-errors/BadRequest'); // 400
const Forbidden = require('../utils/response-errors/Forbidden'); // 403
// Функция добавления фильма
const addMovie = (req, res, next) => {
  movieModel.create({ owner: req.user._id, ...req.body })
    .then((movieItem) => res.status(SUCCESS_CREATED).send(movieItem))
    .catch((error) => {
      // https://mongoosejs.com/docs/api/error.html#error_Error-ValidationError
      if (error instanceof ValidationError) next(new BadRequests('Переданы некорректные данные при добавлении фильма'));
      else next(error);
    });
};
// Функция удаления фильма
const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.movieId)
    .orFail(() => next(new NotFound('Фильм по указанным данным не найден на сервере')))
    .then((movieItem) => {
      if (movieItem.owner.equals(req.user._id)) {
        return movieModel.findByIdAndRemove(req.params.movieId).then(() => res.send({ message: 'Выбранный фильм успешно удалён' })).catch(next);
      } return next(new Forbidden('Вы не являетесь автором фильма, удаление невозможно'));
    })
    .catch((error) => {
      // https://mongoosejs.com/docs/api/error.html#error_Error-CastError
      if (error instanceof CastError) next(new BadRequests('Переданы некорректные данные фильма'));
      else next(error);
    });
};
// Функция получения списка фильмов
const getMovieList = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movieItems) => res.send(movieItems)).catch(next);
};

module.exports = {
  addMovie, deleteMovie, getMovieList,
};
