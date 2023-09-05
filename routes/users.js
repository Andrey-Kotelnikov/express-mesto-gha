const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getUserMe, createUser, updateUser, updateAvatar } = require('../controllers/users');
const urlRegex = require('../utils/utils');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  })
}), getUserById);

//router.post('/', createUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
}), updateAvatar);

module.exports = router;