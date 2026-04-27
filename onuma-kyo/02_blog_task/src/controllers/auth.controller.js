import * as usecase from '../usecase/auth.usecase.js';

const handleError = (reply, error) => {
  console.error('Error: ', error);
  reply.code(500);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(error);
};

export const loginHandler = async (req, reply) => {
  try {
    const { userId, password } = req.body;
    await usecase.login(userId, password, async (id, csrfToken) => {
      await req.session.regenerate();
      req.session.authenticated = true;
      req.session.user = id;
      req.session.csrfToken = csrfToken;
      reply.send(JSON.stringify({ csrfToken: csrfToken }));
    });
  } catch (error) {
    handleError(reply, error);
  }
};

export const logoutHandler = async (req, reply) => {
  try {
    if (req.session.authenticated) {
      req.session.destroy();
    }
    reply.send(JSON.stringify({ message: 'ログアウト処理成功' }));
  } catch (error) {
    handleError(reply, error);
  }
};

export const meHandler = async (req, reply) => {
  try {
    const id = req.session.user;
    reply.send(JSON.stringify({ id: id }));
  } catch (error) {
    handleError(reply, error);
  }
};
