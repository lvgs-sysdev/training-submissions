import * as usecase from '../usecase/user.usecase.js';

const handleError = (reply, error) => {
  console.error('Error: ', error);
  reply.code(500);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(error);
};

export const getUsersHandler = async (request, reply) => {
  try {
    const users = await usecase.getUsers();
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(users);
  } catch (error) {
    handleError(reply, error);
  }
};

export const getUserHandler = async (request, reply) => {
  try {
    const { userId } = request.params;
    const user = await usecase.getUser(userId);
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(user);
  } catch (error) {
    handleError(reply, error);
  }
};

export const getUserBySurrogateKeyHandler = async (request, reply) => {
  try {
    const { id } = request.params;
    const user = await usecase.getUserBySurrogateKey(id);
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(user);
  } catch (error) {
    handleError(reply, error);
  }
};

export const addUserHandler = async (req, reply) => {
  try {
    const { userId, password, userName, email, snsLink } = req.body;
    await usecase.addUser(userId, password, userName, email, snsLink);
    reply.send(JSON.stringify({ message: 'User added' }));
  } catch (error) {
    handleError(reply, error);
  }
};

export const updateUserHandler = async (req, reply) => {
  try {
    const { userId, userName, email, snsLink } = req.body;
    const { orgUserId } = req.params;
    // CsrfTokenの検証
    const clientCsrfToken = req.headers['x-csrf-token'];
    const serverCsrfToken = req.session.csrfToken;
    if (clientCsrfToken !== serverCsrfToken) {
      throw new Error(`CSRFトークンの検証に失敗しました`);
    }
    await usecase.updateUser(orgUserId, userId, userName, email, snsLink);
    reply.send(JSON.stringify({ message: 'User updated' }));
  } catch (error) {
    handleError(reply, error);
  }
};
