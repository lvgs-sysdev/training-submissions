import bcrypt from "bcrypt";
import { SignUpDao } from "../dao/signUpDao";
import { CustomError } from "../errors/customError";
import { CheckRequiredInput } from "../utils/checkRequiredInput";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCode";

export class SignUpService {
  private dao = new SignUpDao();
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
    const hashed = await bcrypt.hash(password, 10);
    await this.dao.signUp(email, hashed);
  };

  private checkIfSameEmailExists = async (email: string) => {
    const isExist = await this.dao.isEmailExists(email);
    if (isExist) {
      throw new CustomError(
        ERROR_MESSAGES.ALREADY_REGISTERD,
        STATUS_CODES.CONFLICT
      );
    }
  };
}
