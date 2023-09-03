const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Проверка наличия токена и его начало bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  // Верификация токена
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return err.status(401).send({ message: 'Необходима авторизация' })
  }

  req.user = payload; // Запись пейлоуда в запрос

  next();
};