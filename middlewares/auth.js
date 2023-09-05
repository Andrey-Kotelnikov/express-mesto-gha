const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

const { JWT_SECRET = "key" } = process.env;

module.exports = (req, res, next) => {
  const authCookie = req.cookies.jwt;

  // Проверка наличия кук
  if (!authCookie) {
    // throw new UnauthorizedError('Необходима авторизация: нет токена')

    return next(new UnauthorizedError("Необходима авторизация: нет токена"));
    // return res.status(401).send({ message: 'Необходима авторизация' })
  }

  // Достанем токен
  // const token = authCookie
  let payload;

  // Верификация токена

  try {
    payload = jwt.verify(authCookie, JWT_SECRET);
  } catch (err) {
    return next(
      new UnauthorizedError("Необходима авторизация: токен неверный"),
    );
  }
  console.log(payload);
  req.user = payload; // Запись пейлоуда в запрос

  return next();
};
