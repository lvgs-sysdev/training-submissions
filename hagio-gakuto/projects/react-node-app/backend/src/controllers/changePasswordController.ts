import { Request, Response } from "express";
import { ChangePasswordService } from "../services/changePasswordService";

export class ChangePasswordController {
  private service = new ChangePasswordService();

  changePassword = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    await this.service.changePassword(req.body, userId);
    res.status(200).json({ message: "登録成功" });
  };
}
