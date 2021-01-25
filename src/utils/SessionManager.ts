import encrypter from './Encrypter';
import Session, { SessionProps } from '../models/Session';
import { UserProps } from '../models/User';

class SessionManager {
  /**
   * Creates a new session for the given user
   * @param user User object from the database
   * @returns The session's token
   */
  public async addSession(user: UserProps): Promise<string> {
    const token = encrypter.randomString(256);
    const session = {
      _id: token,
      user: user._id,
      time: new Date().getTime(),
    };
    return Session.create(session)
      .then((res) => res._id)
      .catch(() => null);
  }

  /**
   * Deletes an User Session by the token
   * @param token Session's token
   * @returns Boolean that indicates that the session was deleted or not
   */
  public async deleteSession(token: string): Promise<boolean> {
    return Session.findByIdAndDelete(token)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Deletes an User Session by the userId
   * @param user User's ID
   * @returns Boolean that indicates that the session was deleted or not
   */
  public async deleteSessionByUser(user: string): Promise<boolean> {
    return Session.findOneAndDelete({ user })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Returns the session if it exists
   * @param token Session's token
   * @returns The session document
   */
  public async getSession(token: string): Promise<SessionProps | null> {
    return Session.findById(token).populate({
      path: 'user',
      select: '-password -__v',
    });
  }
}

export default new SessionManager();
