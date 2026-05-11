import * as usecase from '../usecase/auth.usecase.js';

export const loginHandler = async (req, reply) => {
  const { userId, password } = req.body;
  await usecase.login(userId, password, async (id, csrfToken) => {
    await req.session.regenerate(); // セッションフィクセーション対策のためログイン後にセッションID再生成
    req.session.authenticated = true;
    req.session.user = id;
    req.session.csrfToken = csrfToken;
    reply.type('application/json').code(200);
    reply.send(JSON.stringify({ csrfToken: csrfToken }));
  });
};

export const logoutHandler = async (req, reply) => {
  if (req.session.authenticated) {
    req.session.destroy();
  }
  reply.type('application/json').code(200);
  reply.send(JSON.stringify({ message: 'ログアウト処理成功' }));
};

export const meHandler = async (req, reply) => {
  const id = req.session.user;
  reply.type('application/json').code(200);
  reply.send(JSON.stringify({ id: id }));
};
