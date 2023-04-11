const mainRouter = require('express').Router();

const { registerUser, authorizeUser, logoutUser } = require('../controllers/users');
const authGuard = require('../middlewares/auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { validateAuthorizeUser, validateRegisterUser } = require('../utils/data-validation');
// Классы ошибок
const NotFound = require('../utils/response-errors/NotFound');

// Проверяет переданные в теле почту и пароль и возвращает JWT.
mainRouter.post('/signin', validateAuthorizeUser, authorizeUser);
// Создаёт пользователя с переданными в теле email, password и name.
mainRouter.post('/signup', validateRegisterUser, registerUser);

// Защита авторизацией
mainRouter.use(authGuard);
mainRouter.use('/users', userRouter);
mainRouter.use('/movies', moviesRouter);
// При запросе к роуту удалится JWT из куков пользователя.
mainRouter.get('/signout', logoutUser);
mainRouter.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

module.exports = mainRouter;
