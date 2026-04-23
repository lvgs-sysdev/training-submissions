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
    await usecase.login(userId, password, async (id) => {
      await req.session.regenerate();
      req.session.authenticated = true;
      req.session.user = id;
      reply.send(JSON.stringify({ message: 'Auth succeed' }));
    });
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
