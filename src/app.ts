import express from 'express';
import compression from 'compression';
import cors from 'cors';
import config from './config/config';
import morgan from './config/morgan';
import routes from './routes/v1';
import passport from 'passport';
import strategy from './config/passport';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(passport.initialize());
app.use(passport.initialize());

passport.use(strategy);

app.use(cors());
app.options(/(.*)/, cors());

app.use('/v1', routes);

export default app;
