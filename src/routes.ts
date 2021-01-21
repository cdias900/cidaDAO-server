import express from 'express';
import multer from 'multer';

import * as Controllers from './controllers';
import * as Validation from './validation';

import multerConfig from './config/multer';

const routes = express.Router();

routes.get('/users', Controllers.User.index);
routes.post('/user', Controllers.User.create);

routes.get('/wishes', Controllers.Wish.index);
routes.post(
  '/wish',
  multer(multerConfig).single('image'),
  Validation.Wish.create,
  Controllers.Wish.create
);

routes.post('/login', Controllers.Session.create);
routes.post('/logout', Controllers.Session.delete);

export default routes;
