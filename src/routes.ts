import express from 'express';
import multer from 'multer';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import WishController from './controllers/WishController';

import multerConfig from './config/multer';

const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/user', UserController.create);

routes.post('/wish', multer(multerConfig).single('image'), WishController.create);

routes.post('/login', SessionController.create);
routes.post('/logout', SessionController.delete);

export default routes;
