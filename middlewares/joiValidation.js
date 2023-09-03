const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/utils');

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex)
  }),
});

module.exports = {
  userValidation
}
