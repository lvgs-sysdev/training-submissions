import { Request, Response } from "express";
import { LoginService } from "../services/loginService";

export class AuthController {
  private service = new LoginService();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.service.login(email, password);

    if (!token) {
      return res.status(401).json({ message: "認証失敗" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.json({ message: "ログイン成功" });
  };
}
