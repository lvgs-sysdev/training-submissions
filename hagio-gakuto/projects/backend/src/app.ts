import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ログイン確認関数
// function authMiddleware(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   try {
//     const decoded = jwt.verify(token, "your-secret-key");
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid Token" });
//   }
// }
// 例えば /api/user 以下はログイン必須にしたいなら
// app.use("/api/user", authMiddleware, userRouter);
// // /api/login はログイン用なので認証不要
// app.use("/api/login", loginRouter);

// 簡単なAPI（認証付き）
app.get("/api/:id", (req, res) => {
  console.log("aaa");
  console.log(req);
  res.json({ message: "ログイン済みユーザーのみ見える" });
});
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
