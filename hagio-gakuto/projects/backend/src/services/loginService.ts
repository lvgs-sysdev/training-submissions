import { CheckRequiredInput } from "../utils/checkRequiredInput";
import jwt from "jsonwebtoken";
import { UserService } from "./userService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class LoginService {
  private service = new UserService();
  private checkRequiredInput = new CheckRequiredInput();

  login = async (data: { email: string; password: string }) => {
    await this.validateInputs(data);
    const token = await this.executeLogin(data);
    return token;
  };

  private validateInputs = async (data: {
    email: string;
    password: string;
  }) => {
    const { email, password } = data;
    await this.checkRequiredInput.checkRequiredInput({
      key: "email",
      value: email,
    });
    await this.checkRequiredInput.checkRequiredInput({
      key: "password",
      value: password,
    });
  };

  private executeLogin = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const user = await this.service.findUserByEmail(email);
    await this.service.comparePasswordAndHashedPasswordThrows401(
      password,
      user.hashedPassword,
      ERROR_MESSAGES.LOGIN_FAILED
    );
    // 認証成功後、JWTを生成
    const token = await this.generateToken(user.id, user.name);
    return token;
  };

  private generateToken = async (id: number, name: string) => {
    const payload = { userId: id, name: name };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: parseInt(process.env.JWT_EXPIRIES_TIME!, 10), // トークンの有効期限
    });
    return token;
  };
}
