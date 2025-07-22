import { Request, Response } from "express";

export class LogoutController {
  public logout = (req: Request, res: Response) => {
    // 'token'という名前のクッキーをクリアするよう指示
    res.clearCookie("token");
    // 成功したことをクライアントに通知
    res.status(200).json({ message: "ログアウトしました" });
  };
}
