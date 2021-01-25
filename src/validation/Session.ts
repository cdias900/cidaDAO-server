import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import Session from '../utils/SessionManager';

class SessionValidation {
  public readonly authHeader = celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  });

  public async validateSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const token = req.headers.authorization;
    if (token) {
      const session = await Session.getSession(token);
      if (!session) {
        return res.status(401).send();
      }
      req.session = session;
      return next();
    }
    return res.status(401).send();
  }
}

export default new SessionValidation();
