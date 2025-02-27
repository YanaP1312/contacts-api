import { THIRTY_MINUTES } from '../constants/tokenTime.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetPasswordEmail,
  resetPassword,
} from '../db/services/auth.js';

const setupSessionCookies = (session, res) => {
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSessionCookies(session, res);

  res.status(201).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });
  setupSessionCookies(session, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session',
    data: { accessToken: session.accessToken },
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetPasswordEmail(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.json({
    status: 200,
    message: 'Successfully reset password!',
    data: {},
  });
};
