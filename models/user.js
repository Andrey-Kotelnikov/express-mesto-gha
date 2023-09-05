const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require('bcryptjs');
const urlRegex = require("../utils/utils");
// const { UnauthorizedError } = require('../utils/errors');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Некорректный Email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator(v) {
          return urlRegex.test(v);
        },
        message: "Некорректный URL у поля avatar",
      },
    },
  },
  {
    versionKey: false,
  },
);

// Метод поиска user по почте и паролю
/* userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password)
      .then((matched) => {
        console.log(matched + ' login mached');
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      })
    })
}; */

module.exports = mongoose.model("user", userSchema);
