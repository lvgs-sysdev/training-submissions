import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import loginRouter from "./routes/loginRouter";
import signUpRouter from "./routes/signUpRouter";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// 簡単なAPI（認証付き）
app.use("/api/login", loginRouter);
app.use("/api/signup", signUpRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
