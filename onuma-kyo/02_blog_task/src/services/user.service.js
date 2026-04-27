import * as repository from '../repositories/user.repository.js';

export const exist = async (userId) => {
  const user = await repository.findByID(userId);
  return user.length !== 0;
};

export const validateAdd = (userId, password, userName, email, snsLink) => {
  validateUserId(userId);
  validatePassword(password);
  validateUserName(userName);
  validateEmail(email);
  validateSnsLink(snsLink);
};

export const validateUpdate = (userName, email, snsLink) => {
  validateUserName(userName);
  validateEmail(email);
  validateSnsLink(snsLink);
};

const validateUserId = (userId) => {
  const pattern = /^([a-zA-Z0-9]|\.|_|-){1,20}$/;
  if (pattern.test(userId)) {
    return;
  }
  throw new Error(`ユーザーIDの形式が不正です。`);
};
const validatePassword = (password) => {
  const pattern = /^([a-zA-Z0-9]|\.|_|-){8,255}$/;
  if (pattern.test(password)) {
    return;
  }
  throw new Error(`パスワードの形式が不正です。`);
};
const validateUserName = (userName) => {
  const pattern = /^.{1,225}$/;
  if (pattern.test(userName)) {
    return;
  }
  throw new Error(`ユーザー名の形式が不正です。`);
};
const validateEmail = (email) => {
  const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
  if (pattern.test(email)) {
    return;
  }
  throw new Error(`Eメールの形式が不正です。`);
};
const validateSnsLink = (snsLink) => {
  const pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;
  if (pattern.test(snsLink)) {
    return;
  }
  throw new Error(`ユーザーIDの形式が不正です。`);
};
