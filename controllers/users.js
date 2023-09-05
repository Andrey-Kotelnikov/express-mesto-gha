const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError, UnauthorizedError, ValidationError, ExistError } = require('../utils/errors');
const { JWT_SECRET = 'key' } = process.env;

// Получение всех пользователей
module.exports.getUsers = (req, res, next) => {
  console.log(req.cookies.jwt)
  return User.find({})
    .then(users => res.send(users))
    .catch(next);
};

// Получение пользователя по id
module.exports.getUserById = (req, res, next) => {
  return User.findById(req.params.id)
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
  return User.findById(req.user._id)
    //.orFail(new Error('NotValidId'))
    .then(user => res.send({ data: user }))
    .catch(next);
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { email, name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({ email, password: hash, name, about, avatar })
    .then(user => {
      const { _id, email, name, about, avatar } = user;
      res.status(201).send({ _id, email, name, about, avatar });
    })
    .catch(err => {
      console.log(err)
      if (err.code === 11000) {
        return next(new ExistError('Такой пользователь существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
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
        return next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
      }
      next(err);
    })
};

// Обновление аватара
module.exports.updateAvatar = (req, res, next) => {
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
        return next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`))
      }
      next(err);
    })
};





/*userSchema.statics.findUserByCredentials = function (email, password) {
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
};*/





// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;


  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'))
        //throw new UnauthorizedError('Неправильные почта или пароль')
      }
      bcrypt.compare(password, user.password, function(err, isValidPassword) {
        if (!isValidPassword) {
          return next(new UnauthorizedError('Неправильные почта или пароль'))
          //throw new UnauthorizedError('Неправильные почта или пароль');
        }
        console.log(user._id)
        const { _id, email, name, about, avatar } = user;
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          //sameSite: true,
        }).send({ _id, email, name, about, avatar });
      });
    })
    .catch(next)
};




  /*return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      //res.send({ token })
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({message: 'Успех: в куки записан jwt'})
      //.end();
    })
    .catch(err => {
      next(new UnauthorizedError('Неверный логин или пароль'));
    })*/
