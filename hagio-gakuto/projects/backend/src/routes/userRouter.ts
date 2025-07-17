import express from "express";

const userRouter = express.Router();
// ユーザー一覧取得
userRouter.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Taro" },
    { id: 2, name: "Hanako" },
  ]);
});

// ユーザー詳細取得
userRouter.get("/:id", (req, res) => {
  const userId = req.params.id;
  // ここでDBから取得したりする想定
  res.json({ id: userId, name: "Taro" });
});

// ユーザー作成
userRouter.post("/", (req, res) => {
  const newUser = req.body;
  // ここでDBに保存処理など
  res.status(201).json({ message: "ユーザー作成成功", user: newUser });
});

export default userRouter;
