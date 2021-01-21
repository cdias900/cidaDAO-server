import { Request, Response } from 'express';
import basicAuth from 'basic-auth';

import User from '../models/User';
import Encrypter from '../utils/Encrypter';

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    const users = await User.find();
    return res.json(users);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const auth = basicAuth(req);
    const { name, email, phone, cpf }: UserData = req.body;
    if(auth) {
      const { name: username, pass: password } = auth;
      let user = await User.findOne({ $or: [{ username }, { email }] });
      if(!user) {
        user = await User.create({
          username,
          email,
          phone,
          cpf,
          name,
          password: Encrypter.hashPassword(password),
        })
        return res.status(201).json({ userId: user._id });
      }
    }
    return res.status(400).send();
  }
}

export default new UserController();
