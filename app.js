const express = require('express');
const mongooose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express();

// Используем сборщик данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongooose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
}).then(() => {console.log('Подключено к mongoDB')});

app.use((req, res, next) => {
  req.user = {
    _id: '64ec8add51f76cfbf3f725e2'
  }

  next();
});

app.use('/users', userRouter); // Настраиваем роуты для users
app.use('/cards', cardRouter); // Настраиваем роуты для cards


process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
})




app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})