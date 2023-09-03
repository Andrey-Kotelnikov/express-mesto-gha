const express = require('express');
const mongooose = require('mongoose');
const process = require('process');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
//const { required } = require('joi');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

// Используем сборщик данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet()); // Используем защиту
app.use(cookieParser()); // Сборщик кук

// Подключение к БД
mongooose.connect(DB_URL, {
  useNewUrlParser: true
}).then(() => {console.log('Подключено к mongoDB')});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/w?w?w?\.?[0-9a-z\-\._~:\/\?\#\[\]\@!\$&'\(\)\*\+\,\;\=]{1,}\#?/mi),
  }),
}), login); // Роут логина
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser); // Роут регистрации
app.use('/users', auth, userRouter); // Настраиваем роуты для users
app.use('/cards', auth, cardRouter); // Настраиваем роуты для cards
app.use('*', (req, res) => { // Остальные пути
  res.status(404).send({message: 'Неверный путь'});
});

// Обработчик неотловленных ошибок
process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
})

// Обработчик ошибок приходящих от celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message} = err;
  res.status(statusCode).send({
    message: statusCode === 500
    ? 'На сервере произошла ошибка'
    : message
  })
})

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})