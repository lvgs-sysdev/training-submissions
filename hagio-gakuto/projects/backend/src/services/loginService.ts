import bcrypt from "bcrypt";
import { CustomError } from "../errors/customError";
import { CheckRequiredInput } from "../utils/checkRequiredInput";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCode";
import { LoginDao } from "../dao/loginDao";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export class LoginService {
  private dao = new LoginDao();
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
    const user = await this.findUser(email);
    await this.comparePasswordAndHashedPassword(password, user.hashedPassword);
    // 認証成功後、JWTを生成
    const token = await this.generateToken(user.id, user.name);
    return token;
  };

  private findUser = async (email: string): Promise<User> => {
    const user = await this.dao.findUserByEmail(email);
    if (!user) {
      throw new CustomError(
        ERROR_MESSAGES.LOGIN_FAILED, // 1. message
        STATUS_CODES.UNAUTHORIZE
      );
    }
    return user;
  };

  private comparePasswordAndHashedPassword = async (
    password: string,
    hashedPassword: string
  ) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new CustomError(
        ERROR_MESSAGES.LOGIN_FAILED, // 1. message
        STATUS_CODES.UNAUTHORIZE
      );
    }
  };

  private generateToken = async (id: number, name: string) => {
    const payload = { userId: id, name: name };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: parseInt(process.env.JWT_EXPIRIES_TIME!, 10), // トークンの有効期限
    });
    return token;
  };
}
