import express from 'express';
import multer from 'multer';

import * as Controllers from './controllers';
import * as Validation from './validation';

import multerConfig from './config/multer';

const routes = express.Router();

routes.post(
  '/user',
  Validation.User.create,
  Validation.Session.authHeader,
  Controllers.User.create
);
routes.get('/user', Validation.Session.validateSession, Controllers.User.self);
routes.put(
  '/user',
  Validation.Session.validateSession,
  Validation.User.update,
  Controllers.User.update
);
routes.get('/user/:id', Validation.Session.validateSession, Controllers.User.find);

routes.get('/wishes', Validation.Session.validateSession, Controllers.Wish.index);
routes.get('/wish/:id', Validation.Session.validateSession, Controllers.Wish.find);
routes.post(
  '/wish',
  multer(multerConfig).array('image', 3),
  Validation.Session.validateSession,
  Validation.Wish.create,
  Controllers.Wish.create
);
routes.post('/like/:id', Validation.Session.validateSession, Controllers.Wish.like);

routes.post('/login', Validation.Session.authHeader, Controllers.Session.create);
routes.post('/logout', Validation.Session.authHeader, Controllers.Session.delete);

export default routes;
