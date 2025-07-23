import bcrypt from "bcrypt";
import { SignUpDao } from "../dao/signUpDao";
import { CustomError } from "../errors/customError";
import { CheckRequiredInput } from "../utils/checkRequiredInput";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCode";
import { passwordValidation } from "../utils/regex";
import { UserService } from "./userService";

export class SignUpService {
  private dao = new SignUpDao();
  private userService = new UserService();
  private checkRequiredInput = new CheckRequiredInput();

  signUp = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    await this.validateInputs(data);
    await this.insertDB(data);
  };

  private validateInputs = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { email, password, confirmPassword } = data;
    await this.checkRequiredInput.checkRequiredInput({
      key: "email",
      value: email,
    });
    await this.checkRequiredInput.checkRequiredInput({
      key: "password",
      value: password,
    });
    await this.checkRequiredInput.checkRequiredInput({
      key: "confirmPassword",
      value: confirmPassword,
    });

    const isValidPassword = await passwordValidation(password);
    if (!isValidPassword) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_PASSWORD,
        STATUS_CODES.VALIDATION_ERROR,
        "password"
      );
    }

    if (password !== confirmPassword) {
      throw new CustomError(
        ERROR_MESSAGES.PASSWORD_MISMATCH,
        STATUS_CODES.VALIDATION_ERROR,
        "confirmPassword"
      );
    }
  };

  private insertDB = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    await this.checkIfSameEmailExists(email);
    const hashed = await this.userService.hashPassword(password);
    await this.dao.signUp(email, hashed);
  };

  private checkIfSameEmailExists = async (email: string) => {
    const isExist = await this.userService.isEmailExists(email);
    if (isExist.rows[0].exists) {
      throw new CustomError(
        ERROR_MESSAGES.ALREADY_REGISTERD,
        STATUS_CODES.CONFLICT
      );
    }
  };
}
