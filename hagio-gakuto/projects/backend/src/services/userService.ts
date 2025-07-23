import { CheckRequiredInput } from "../utils/checkRequiredInput";
import { UserDao } from "../dao/userDao";
import { User } from "../models/User";
import { CustomError } from "../errors/customError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCode";
import bcrypt from "bcrypt";

export class UserService {
  private dao = new UserDao();
  private checkRequiredInput = new CheckRequiredInput();

  findUserByEmail = async (email: string): Promise<User | null> => {
    this.checkRequiredInput.checkInputThrows500(email);
    const user = await this.dao.findUserByEmail(email);

    if (!user) {
      return null;
    }
    return user;
  };

  findUserById = async (userId: number): Promise<User> => {
    this.checkRequiredInput.checkInputThrows500(userId);
    const user = await this.dao.findUserById(userId);

    if (!user) {
      throw new CustomError(
        ERROR_MESSAGES.SERVER_ERROR,
        STATUS_CODES.SERVER_ERROR
      );
    }
    return user;
  };

  isEmailExists = async (email: string) => {
    const isExist = this.dao.isEmailExists(email);
    return isExist;
  };

  comparePasswordAndHashedPasswordThrows401 = async (
    password: string,
    hashedPassword: string,
    message: string
  ) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new CustomError(message, STATUS_CODES.UNAUTHORIZE);
    }
  };

  hashPassword = async (password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  };
}
