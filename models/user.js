const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Unauthorized = require('../utils/response-errors/Unauthorized');

// Схема базы данных пользователя
const userSchema = new mongoose.Schema({
  // Почта пользователя, по которой он регистрируется. Это обязательное поле.
  email: {
    type: String,
    unique: true,
    validate: { validator: (correct) => validator.isEmail(correct), message: 'Ошибка валидации почты' },
    required: true,
  },
  // Хеш пароля. Обязательное поле-строка.
  password: { type: String, select: false, required: true },
  // Имя пользователя. Это обязательное поле-строка от 2 до 30 символов.
  name: {
    type: String, minlength: 2, maxlength: 30, required: true,
  },
});

// Then you can pull it in as needed in find and populate calls via field selection as '+password'
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((selectedUser) => {
      if (!selectedUser) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены некорректно')); }
      return bcrypt.compare(password, selectedUser.password).then((correct) => {
        if (!correct) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены некорректно')); }
        return selectedUser;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
