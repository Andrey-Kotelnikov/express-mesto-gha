const User = require('../models/user');

/*class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = "CastError";
    this.statusCode = 404;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}*/


// Получение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({message: 'Ошибка сервера'}));
};

// Получение пользователя по id
module.exports.getUserById = (req, res) => {
  console.log(req.params)
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден'})
      }
      res.send({ data: user })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(500).send({message: 'Ошибка сервера'});
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
        res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(500).send({message: 'Ошибка сервера'});
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
        res.status(404).send({message: 'Пользователь не найден'})
      }
      res.send({ data: user})
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(500).send({message: 'Ошибка сервера'});
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
        res.status(404).send({message: 'Пользователь не найден'})
      }
      res.send({data: user})
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(500).send({message: 'Ошибка сервера'});
      }
    })
};