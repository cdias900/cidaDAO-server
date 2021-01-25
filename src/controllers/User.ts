import { Request, Response } from 'express';
import basicAuth from 'basic-auth';

import User, { UserProps } from '../models/User';
import Encrypter from '../utils/Encrypter';

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const auth = basicAuth(req);
    const { name, email, phone, cpf }: UserData = req.body;
    if(auth) {
      const { name: username, pass: password } = auth;
      let user = await User.findOne({ $or: [{ username }, { email }, { cpf }] });
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

  public async self(req: Request, res: Response): Promise<Response> {
    const { session } = req;
    if(!session) return res.status(401).send();
    return res.status(200).json(session.user);
  }

  public async find(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -__v');
    if(!user) return res.status(404).send();
    return res.status(200).json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { bio } = req.body;
    const { session } = req;
    if(!session) return res.status(401).send();
    const user = await User.findById((session.user as UserProps)._id);
    if(!user) return res.status(404).send();
    user.bio = bio || user.bio;
    await user.save();
    return res.status(200).send();
  }
}

export default new UserController();
