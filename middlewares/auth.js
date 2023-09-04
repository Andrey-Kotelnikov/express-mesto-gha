const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const authCookie = req.cookies.jwt;
  console.log(authCookie)

  // Проверка наличия токена и его начало bearer
  if (!authCookie) {
    throw new UnauthorizedError('Необходима авторизация')
    //return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  const token = authCookie
  let payload;

  // Верификация токена
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'))
    //return err.status(401).send({ message: 'Необходима авторизация' })
  }

  req.user = payload; // Запись пейлоуда в запрос

  next();
};