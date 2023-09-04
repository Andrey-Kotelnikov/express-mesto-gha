const { jwt } = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const {JWT_SECRET = 'key'} = process.env;

module.exports = (req, res, next) => {
  const authCookie = req.cookies.jwt;
  //console.log(authCookie)

  // Проверка наличия кук
  if (!authCookie) {
    //throw new UnauthorizedError('Необходима авторизация: нет токена')

    return next(new UnauthorizedError('Необходима авторизация: нет токена'));
    //return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  const token = authCookie
  let payload;

  // Верификация токена
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      next(new UnauthorizedError('Необходима авторизация: токен неверный'));
    }
    payload = decoded;
  });
  console.log(payload)
  req.user = payload; // Запись пейлоуда в запрос

  next();
};