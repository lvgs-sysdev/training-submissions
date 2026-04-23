import * as repository from '../repositories/user.repository.js';
import * as service from '../services/user.service.js';
import * as authService from '../services/auth.service.js';

export const getUsers = async () => {
  return repository.findAll();
};

export const getUser = async (userId) => {
  const user = await repository.findByID(userId);
  if (user.length == 0) {
    throw new Error(`User not found. userId: ${userId}`);
  }
  return JSON.stringify(user[0]);
};

export const getUserBySurrogateKey = async (id) => {
  const user = await repository.findBySurrogateKey(id);
  if (user.length == 0) {
    throw new Error(`User not found. surrogateKey: ${id}`);
  }
  return JSON.stringify(user[0]);
};

export const addUser = async (userId, password, userName, email, snsLink) => {
  if (await service.exist(userId)) {
    throw new Error(`User with the same user ID is already registered. userId: ${userId}`);
  }

  const passwordHashed = authService.hashPassword(password);
  repository.create(userId, passwordHashed, userName, email, snsLink);
};

export const updateUser = async (orgUserId, userId, userName, email, snsLink) => {
  // 編集前ユーザーIDをキーとして更新対象を取得
  const user = await repository.findByID(orgUserId);
  if (user.length == 0) {
    throw new Error(`User not found. userId: ${orgUserId}`);
  }
  // 編集後ユーザーIDで重複チェック
  if (await service.exist(userId)) {
    throw new Error(`User with the same user ID is already registered. userId: ${userId}`);
  }
  // システムキーをキーとして更新
  await repository.update(user[0].id, userId, userName, email, snsLink);
};
