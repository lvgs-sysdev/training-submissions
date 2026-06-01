import * as repository from '../repositories/user.repository.js';
import * as authService from '../services/auth.service.js';
import { UnauthorizedError } from '../utils/customError.js';

export const login = async (userId, password, createSession) => {
  const user = await repository.findByID(userId);

  if (user.length === 0) {
    throw new UnauthorizedError(`入力されたIDのユーザーは登録されていません。userID: ${userId}`);
  }

  if (!authService.verifyPassword(user[0].password, password)) {
    throw new UnauthorizedError(`パスワードが間違っています。`);
  }
  createSession(user[0].id, authService.generateCSRFToken());
};
