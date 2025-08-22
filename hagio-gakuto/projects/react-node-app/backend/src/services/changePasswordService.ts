import { CustomError } from "../errors/customError";
import { CheckRequiredInput } from "../utils/checkRequiredInput";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCode";
import { passwordValidation } from "../utils/regex";
import { UserService } from "./userService";
import { ChangePasswordDao } from "../dao/changePasswordDao";

export class ChangePasswordService {
  private dao = new ChangePasswordDao();
  private userService = new UserService();
  private checkRequiredInput = new CheckRequiredInput();

  changePassword = async (
    data: {
      password: string;
      newPassword: string;
      confirmPassword: string;
    },
    userId: number
  ) => {
    await this.validateInputs(data);
    await this.comparePassword(userId, data);
    await this.updateDB(userId, data);
  };

  private validateInputs = async (data: {
    password: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { password, newPassword, confirmPassword } = data;
    await this.checkRequiredInput.checkRequiredInput({
      key: "password",
      value: password,
    });
    await this.checkRequiredInput.checkRequiredInput({
      key: "newPassword",
      value: newPassword,
    });
    await this.checkRequiredInput.checkRequiredInput({
      key: "confirmPassword",
      value: confirmPassword,
    });

    const isValidPassword = await passwordValidation(newPassword);
    if (!isValidPassword) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_PASSWORD,
        STATUS_CODES.VALIDATION_ERROR,
        "newPassword"
      );
    }

    if (newPassword !== confirmPassword) {
      throw new CustomError(
        ERROR_MESSAGES.PASSWORD_MISMATCH,
        STATUS_CODES.VALIDATION_ERROR,
        "confirmPassword"
      );
    }

    if (newPassword === password) {
      throw new CustomError(
        ERROR_MESSAGES.PASSWORD_NOT_CHANGED,
        STATUS_CODES.VALIDATION_ERROR,
        "newPassword"
      );
    }
  };

  private comparePassword = async (
    userId: number,
    data: { password: string }
  ) => {
    const { password } = data;
    const user = await this.userService.findUserById(userId);
    await this.userService.comparePasswordAndHashedPasswordThrows401(
      password,
      user.hashedPassword,
      ERROR_MESSAGES.PASSWORD_MISMATCH_BETWEEN_DB_AND_INPUT
    );
  };

  private updateDB = async (userId: number, data: { newPassword: string }) => {
    const { newPassword } = data;
    const hashed = await this.userService.hashPassword(newPassword);
    await this.dao.changePassword(userId, hashed);
  };
}
