import bcrypt from 'bcrypt';
import { UserCollection } from '../models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_MINUTES } from '../../constants/tokenTime.js';
import { SessionsCollection } from '../models/session.js';
import crypto from 'node:crypto';
import { getEnvVar } from '../../utils/getEnvVar.js';
import { sendEmail } from '../../utils/sendMail.js';
import { ENV_VARS } from '../../constants/env.js';
import { TEMPLATES_DIR_PATH } from '../../constants/path.js';
import Handlebars from 'handlebars';
import fs from 'node:fs';
import jwt from 'jsonwebtoken';
import path from 'node:path';

const resetEmailTemplate = fs
  .readFileSync(path.join(TEMPLATES_DIR_PATH, 'reset-password-email.html'))
  .toString();

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

export const requestResetPasswordEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar(ENV_VARS.JWT_SECRET),
    { expiresIn: '5m' },
  );

  const resetPasswordLink = `${getEnvVar(
    ENV_VARS.APP_DOMAIN,
  )}/reset-pwd?token=${resetToken}`;

  const template = Handlebars.compile(resetEmailTemplate);
  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  try {
    await sendEmail({
      to: email,
      from: getEnvVar(ENV_VARS.SMTP_FROM),
      subject: 'Reset your password!',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ password, token }) => {
  let payload;

  try {
    payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err.message);
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UserCollection.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(user._id, {
    password: encryptedPassword,
  });
  await SessionsCollection.deleteMany({ userId: user._id });
};
