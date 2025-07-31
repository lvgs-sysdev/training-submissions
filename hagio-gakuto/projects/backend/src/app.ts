import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import signUpRouter from "./routes/signUpRouter";
import authRouter from "./routes/authRouter";
import changePasswordRouter from "./routes/changePasswordRouter";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";

const app = express();
app.use(
  cors({
    origin: "http://43.206.80.105:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(logger);

// --- ルーター定義 ---
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/signup", signUpRouter);
app.use("/api/auth", authRouter);
app.use("/api/password", changePasswordRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
