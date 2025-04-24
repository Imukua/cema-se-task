import express from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config/config';
import morgan from './config/morgan';


const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use(cors());
app.options(/(.*)/, cors());


export default app;