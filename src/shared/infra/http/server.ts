import '@shared/container';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import { AppDataSource } from '@shared/infra/typeorm/data-source';
import ErrorHandleMiddleware from '@shared/middlewares/ErrorHandleMiddleware';
import rateLimiter from '@shared/middlewares/rateLimiter';
import { errors } from 'celebrate';
import routes from './routes';

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(rateLimiter);

    app.use(routes);
    app.use(errors());
    app.use(ErrorHandleMiddleware.handleError);

    console.log('Connected to the database!');

    app.listen(3333, () => {
      console.log('Server started on port 3333!');
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database: ', error);
  });
