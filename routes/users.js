const userRouter = require('express').Router();

const { getUserId, updateUserData } = require('../controllers/users');
const { validateUpdateUserData } = require('../utils/data-validation');

// Возвращает информацию о пользователе (email и имя).
userRouter.get('/me', getUserId);
// Обновляет информацию о пользователе (email и имя).
userRouter.patch('/me', validateUpdateUserData, updateUserData);

module.exports = userRouter;
