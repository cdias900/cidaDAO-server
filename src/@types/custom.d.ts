import { SessionProps } from '../models/Session';

declare global {
  namespace Express {
    export interface Request {
      session?: SessionProps | null;
    }
  }
}
