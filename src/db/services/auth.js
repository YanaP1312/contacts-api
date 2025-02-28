import bcrypt from 'bcrypt';
import { UserCollection } from '../models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_MINUTES } from '../../constants/tokenTime.js';
import { SessionsCollection } from '../models/session.js';
import crypto from 'node:crypto';

const createSession = () => ({
  accessToken: crypto.randomBytes(30).toString('base64'),
  refreshToken: crypto.randomBytes(30).toString('base64'),
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
});

export const registerUser = async ({ email, password, name }) => {
  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email in use');
  const encryptedPassword = await bcrypt.hash(password, 10);

  return await UserCollection.create({
    email,
    password: encryptedPassword,
    name,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const passwordIsEqual = await bcrypt.compare(password, user.password);
  if (!passwordIsEqual) throw createHttpError(401, 'Password is incorrect');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    ...createSession(),
    userId: user._id,
  });
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  await SessionsCollection.deleteOne({
    refreshToken: sessionToken,
    _id: sessionId,
  });
};

export const refreshUsersSession = async ({ sessionToken, sessionId }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'Session user is not found');
  }

  await SessionsCollection.findByIdAndDelete(session._id);
  return await SessionsCollection.create({
    ...createSession(),
    userId: session.userId,
  });
};
