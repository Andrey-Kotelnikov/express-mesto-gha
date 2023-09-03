const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  // Проверка наличия токена и его начало bearer
  if (!cookie || !cookie.startsWith('jwt=')) {
    return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  const token = cookie.replace('jwt=', '');
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