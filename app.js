import { constants as http2Constants } from 'node:http2';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64884d89bc4104e862c0d027',
  };

  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(http2Constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Данная страница не найдена' });
});

app.listen(PORT);
