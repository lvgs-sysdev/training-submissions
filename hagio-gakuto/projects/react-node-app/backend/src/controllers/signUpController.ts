import { Request, Response } from "express";
import { SignUpService } from "../services/signUpService";

export class SignUpController {
  private service = new SignUpService();

  signUp = async (req: Request, res: Response) => {
    await this.service.signUp(req.body);
    res.status(201).json({ message: "登録成功" });
  };
}
