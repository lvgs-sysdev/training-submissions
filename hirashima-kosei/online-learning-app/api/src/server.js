import fastify from "fastify";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import dbConnector from "./db/db-connector.js";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/user.js";
import courseRoutes from "./routers/course.js";
import contentRoutes from "./routers/content.js";

const app = fastify({
  logger: {
    level: process.env.FASTIFY_LOG_LEVEL || "info",
  },
});

app.addHook("onRequest", (req, _reply, done) => {
  req.log.info({ method: req.method, url: req.url }, "incoming request");
  done();
});

app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, "unhandled error");
  reply.code(500).send({ error: "サーバー内部でエラーが発生しました。" });
});

const __filename_esm = fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

const env = process.env.NODE_ENV || "development";
if (env === "development" && !process.env.SESSION_SECRET_KEY) {
  const envPath = path.resolve(__dirname_esm, `../.env.${env}`);
  dotenv.config({ path: envPath });
}

app.register(cookie, {
  secret: process.env.SESSION_SECRET_KEY,
});
const allowedOriginsEnv = process.env.NEXT_ORIGIN || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

app.register(cors, {
  origin: allowedOrigins.length ? allowedOrigins : true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
app.register(dbConnector);

app.register(authRoutes);
app.register(userRoutes);
app.register(courseRoutes);
app.register(contentRoutes);

app.get("/health", async () => {
  return { status: "ok" };
});

try {
  app.listen({ port: 5050, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
