const express = require("express");
const mongooose = require("mongoose");
const process = require("process");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const {
  validationSignin,
  validationSignup,
} = require("./middlewares/joi-validation");
const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

// Подключение к БД
mongooose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Подключено к mongoDB");
  });

app.use(cookieParser()); // Сборщик кук
app.use(bodyParser.json()); // Используем сборщик данных
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet()); // Используем защиту
app.use(
  rateLimit({
    // Ограничитель кол-ва запросов
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.post("/signin", validationSignin, login); // Роут логина
app.post("/signup", validationSignup, createUser); // Роут регистрации

app.use("/users", auth, userRouter); // Настраиваем роуты для users
app.use("/cards", auth, cardRouter); // Настраиваем роуты для cards
app.use("*", auth, (req, res, next) =>
  // Остальные пути
  next(new NotFoundError("Неверный путь")),
);

// Обработчик ошибок приходящих от celebrate
app.use(errors());

// Обработчик неотловленных ошибок //
/* process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
}) */

// Централизованный обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
