const Card = require('../models/card');

const serverError = 500;
const validError = 400;
const notFoundError = 404;

// Получение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate({path: 'user', strictPopulate: false})
    .exec()
    .then(cards => res.send(cards))
    .catch(err => res.status(serverError).send({message: 'Ошибка сервера'}));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req)
  Card.create({ name, link, owner: req.user})
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(validError).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`
        });
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
    });
  };

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => {
      if (!card) {
        res.status(notFoundError).send({message: 'Карточка не найдена'})
      }
      res.send({ data: card })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(validError).send({message: "Некорректный id"});
      } else {
        res.status(serverError).send({message: 'Ошибка сервера'});
      }
    });
};

// Добавление лайка
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {new: true}
  ).then(card => {
    if (!card) {
      res.status(notFoundError).send({message: 'Карточка не найдена'});
    }
    res.send({ data: card });
  })
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(validError).send({message: "Некорректный id"});
    } else {
      res.status(serverError).send({message: 'Ошибка сервера'});
    }
  });
};

// Удаление лайка
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  ).then(card => {
    if (!card) {
      res.status(notFoundError).send({message: 'Карточка не найдена'})
    }
    res.send({ data: card })
  })
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(validError).send({message: "Некорректный id"});
    } else {
      res.status(serverError).send({message: 'Ошибка сервера'});
    }
  });
};