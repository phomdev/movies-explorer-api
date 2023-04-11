require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT, MONGO_URL, API_ADDRESS } = process.env;
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./utils/cors-options');
const responseHandler = require('./middlewares/response-handler');

const app = express();
// Защита сервера
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Импорт основных роутов
const mainRouter = require('./routes/index');

// Блок кода для работы с mongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

app.use('*', cors(corsOptions));
// Логгер
app.use(requestLogger);
// Автоматически проставлять заголовки безопасности
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
// Основные рабочие роуты
app.use('/', mainRouter);
app.use(errorLogger);
// Обработчик ответов
app.use(errors());
app.use(responseHandler);

// Служебная информация: адрес запущенного сервера
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер успешно запущен — ${API_ADDRESS}`);
});
