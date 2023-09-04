const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const authCookie = req.cookies.jwt;
  //console.log(authCookie)

  // Проверка наличия токена и его начало bearer
  if (!authCookie) {
    throw new UnauthorizedError('Необходима авторизация')
    //return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  const token = authCookie
  let payload;

  // Верификация токена
  jwt.verify(token, 'key', (err, decoded) => {
    if (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
    payload = decoded;
  });
  console.log(payload._id)
  req.user = payload._id; // Запись пейлоуда в запрос

  next();
};