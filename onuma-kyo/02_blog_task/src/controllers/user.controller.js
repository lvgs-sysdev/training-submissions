import * as usecase from '../usecase/user.usecase.js';
import { STATUS_CODES } from 'node:http';
import { UnauthorizedError } from '../utils/customError.js';

export const getUsersHandler = async (request, reply) => {
  const users = await usecase.getUsers();
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(users);
};

export const getUserHandler = async (request, reply) => {
  const { userId } = request.params;
  const user = await usecase.getUser(userId);
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(user);
};

export const getUserBySurrogateKeyHandler = async (request, reply) => {
  const { id } = request.params;
  const user = await usecase.getUserBySurrogateKey(id);
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(user);
};

export const addUserHandler = async (req, reply) => {
  const { userId, password, userName, email, snsLink } = req.body;
  await usecase.addUser(userId, password, userName, email, snsLink);
  reply.type('application/json').code(201);
  reply.send(JSON.stringify({ message: 'User added' }));
};

export const updateUserHandler = async (req, reply) => {
  const { userId, userName, email, snsLink } = req.body;
  const { orgUserId } = req.params;
  // CsrfTokenの検証
  const clientCsrfToken = req.headers['x-csrf-token'];
  const serverCsrfToken = req.session.csrfToken;
  if (clientCsrfToken !== serverCsrfToken) {
    throw new UnauthorizedError(`CSRFトークンの検証に失敗しました`);
  }
  await usecase.updateUser(orgUserId, userId, userName, email, snsLink);
  reply.type('application/json').code(200);
  reply.send(JSON.stringify({ message: 'User updated' }));
};
