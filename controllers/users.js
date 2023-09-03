const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError, UnauthorizedError, ValidationError, ExistError } = require('../utils/errors');

// Получение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next);
};

// Получение пользователя по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден')) // В случае ненахода пользователя
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный id'));
        return;
      }
      next(err);
    });
};

// Получение информации о себе
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    //.orFail(new Error('NotValidId'))
    .then(user => res.send({ data: user }))
    .catch(next);
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { email, name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({ email, password: hash, name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch(err => {
      console.log(err)
      if (err.code === 11000) {
        next(new ExistError('Такой пользователь существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
        return;
        /*res.status(validError).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });*/
      }
      next(err);
    }))
};

// Обновление пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  ).orFail(new NotFoundError('Пользователь не найден'))
    .then(user => res.send({ data: user}))
    .catch(err => {
      console.log(err)
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
        return;
      }
      next(err);
    })
};

// Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  ).orFail(new NotFoundError('Пользователь не найден'))
    .then(user => res.send({data: user}))
    .catch(err => {
      console.log(err)
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
        return;
      }
      next(err);
    })
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'key',
        { expiresIn: '7d' });

      res.send({ token })
    })
    .catch(err => {
      next(new UnauthorizedError('Неверный логин или пароль'));
    })
};