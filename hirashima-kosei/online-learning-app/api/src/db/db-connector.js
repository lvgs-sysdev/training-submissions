import mysql from "mysql2/promise";
import fp from "fastify-plugin";

export default fp(
  async (fastify, options) => {
    const dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 3,
      namedPlaceholders: true,
    };

    const dbPool = mysql.createPool(dbConfig);

    fastify.decorate("db", dbPool);

    fastify.addHook("onClose", async () => {
      await fastify.db.end();
    });
  },
  {
    fastify: ">=4.0.0",
    name: "db-connector",
  }
);
