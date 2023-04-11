const { celebrate, Joi } = require('celebrate');
// Регулярное выражение для ссылок
// https://appdevtools.com/regular-expression-tester
const regular = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

// Начало валидации данных пользователя
// Валидация авторизации
const validateAuthorizeUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email()
      .required(),
    password: Joi.string()
      .required(),
  }),
});
// Валидация регистрации
const validateRegisterUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    email: Joi.string().email()
      .required(),
    password: Joi.string()
      .required(),
  }),
});
// Валидация данных обновления пользователя
const validateUpdateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    email: Joi.string().email()
      .required(),
  }),
});

// Начало валидации данных фильма
// Валидация данных создания фильма
const validateAddMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .required(),
    year: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    image: Joi.string().pattern(regular)
      .required(),
    trailerLink: Joi.string().pattern(regular)
      .required(),
    thumbnail: Joi.string().pattern(regular)
      .required(),
    movieId: Joi.number()
      .required(),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
  }),
});
// Валидация данных получения фильма по ID
const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateAuthorizeUser,
  validateRegisterUser,
  validateUpdateUserData,
  validateAddMovie,
  validateMovieId,
};
