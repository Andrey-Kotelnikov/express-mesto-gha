const User = require('../models/user');

const serverError = 500;
const validError = 400;
const notFoundError = 404;

// Получение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(serverError).send({message: 'Ошибка сервера'}));
};

// Получение пользователя по id
module.exports.getUserById = (req, res) => {
  console.log(req.params)
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(notFoundError).send({message: 'Пользователь не найден'})
      }
      res.send({ data: user })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(validError).send({message: "Некорректный id"});
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(validError).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
    })
};

// Обновление пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => {
      if (!user) {
        res.status(notFoundError).send({message: 'Пользователь не найден'})
      }
      res.send({ data: user})
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(validError).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
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
  )
    .then(user => {
      if (!user) {
        res.status(notFoundError).send({message: 'Пользователь не найден'})
      }
      res.send({data: user})
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(validError).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
    })
};