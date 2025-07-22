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
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/signup", signUpRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
