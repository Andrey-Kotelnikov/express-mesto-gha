const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../utils/utils');

const userValidation = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(urlRegex)
    }),
  });
}


const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
  }).unknown(true),
});

module.exports = {
  userValidation,
  validationSignin,
}