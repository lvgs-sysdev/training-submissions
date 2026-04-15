// import "dotenv/config";
import Fastify from "fastify";
import scanRoutes from "./BackendScript/routes/scanRoutes.ts";
import cors from "@fastify/cors";
import usersRoutes from "../src/BackendScript/routes/userRoutes.ts";
// dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(scanRoutes);
fastify.register(usersRoutes);

await fastify.register(cors, {
  origin: "http://localhost:5173",
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
