const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getUserMe, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:id', getUserById);
//router.post('/', createUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
  }),
}), updateAvatar);

module.exports = router;