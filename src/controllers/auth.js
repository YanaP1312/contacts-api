import { THIRTY_MINUTES } from '../constants/tokenTime.js';
import { loginUser, logoutUser, registerUser } from '../db/services/auth.js';

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
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES),
  });

  res.status(201).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: session.accessToken,
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};
