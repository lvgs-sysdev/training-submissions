import { Request, Response } from "express";
import { LoginService } from "../services/loginService";

export class LoginController {
  private service = new LoginService();

  login = async (req: Request, res: Response) => {
    const token = await this.service.login(req.body);
    res.cookie("token", token, {
      httpOnly: true, // JavaScriptからのアクセスを禁止
      secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみで送信
      sameSite: "strict", // CSRF対策
    });
    res.json({ message: "ログイン成功" });
  };
}
