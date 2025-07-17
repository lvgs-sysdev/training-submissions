require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const path = require("path");
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/session"), {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false //クッキーをHTTPS接続でのみ送信する場合はtrue
    , maxAge: 7200000
  }
});
fastify.register(require("./routes/user"));
fastify.register(require("./routes/article"));
fastify.register(require("./routes/login"));

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, ""),
});

fastify.get("/", (request, reply) => {
  reply.sendFile("toppage.html");
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();