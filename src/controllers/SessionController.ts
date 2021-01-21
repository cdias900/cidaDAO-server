import { Response, Request } from 'express';
import basicAuth from 'basic-auth';

import Encrypter from '../utils/Encrypter';
import SessionManager from '../utils/SessionManager';
import User from '../models/User';

class SessionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const auth = basicAuth(req);
    if (auth) {
      const { name: username, pass: password } = auth;
      const user = await User.findOne({ username });
      if (user) {
        SessionManager.deleteSessionByUser(user._id);
        if (
          Encrypter.sha256(password, user.password.salt) ===
          user.password.hash
        ) {
          const token = await SessionManager.addSession(user);
          return res.status(200).json({ token });
        }
        return res.status(401).send();
      }
    }
    return res.status(404).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send();
    const result = await SessionManager.deleteSession(token);
    if (!result) return res.status(400).send();
    return res.status(204).send();
  }
}

export default new SessionController();
