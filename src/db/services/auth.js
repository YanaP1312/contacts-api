import bcrypt from 'bcrypt';
import { UserCollection } from '../models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_MINUTES } from '../../constants/tokenTime.js';
import { SessionsCollection } from '../models/session.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
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
  if (!passwordIsEqual)
    throw createHttpError(401, 'Login or password is incorrect');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    ...createSession,
    userId: user._id,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
