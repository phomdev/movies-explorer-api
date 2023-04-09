const movieRouter = require('express').Router();

const { getMovieList, addMovie, deleteMovie } = require('../controllers/movies');
const { validateAddMovie, validateMovieId } = require('../utils/data-validation');

// Возвращает все сохранённые текущим  пользователем фильмы.
movieRouter.get('/', getMovieList);
// Создаёт фильм с переданными в теле:
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId.
movieRouter.post('/', validateAddMovie, addMovie);
// Удаляет сохранённый фильм по id.
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
