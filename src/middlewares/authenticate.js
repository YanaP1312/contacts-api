import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    next(createHttpError(401, 'Authorization header should be of Bearer type'));
    return;
  }

  if (!token) {
    next(createHttpError(401, 'No Access token provided'));
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'No active session found'));
    return;
  }

  if (session.accessTokenValidUntil < new Date()) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    next(createHttpError(401, 'No user found for such session'));
    return;
  }

  req.user = user;
  next();
};
