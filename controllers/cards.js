const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const { ValidationError, NotFoundError, UnauthorizedError } = require('../utils/errors');

// Получение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate({path: 'user', strictPopulate: false})
    .exec()
    .then(cards => res.send(cards))
    .catch(next);
};

// Создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user})
    .then(card => res.status(201).send(card))
    .catch(err => {
      console.log(err)
      if(err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((err) => err.message).join(', ')}`));
        return;
      }
      next(err);
    });
  };

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner !== req.user._id) {
        throw new UnauthorizedError('Нельзя удалять карточки других пользователей')
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(card => res.send({ data: card }))
        .catch(err => {
          if (err.name === 'CastError') {
            next(new ValidationError('Некорректный id'));
            return;
          }
          next(err);
        });
      })
    .catch(err => {
      console.log(err)
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный id'));
        return;
      }
      next(err);
    });
};

// Добавление лайка
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {new: true}
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный id'));
        return;
      }
      next(err);
  });
};

// Удаление лайка
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный id'));
        return;
      }
      next(err);
    });
};