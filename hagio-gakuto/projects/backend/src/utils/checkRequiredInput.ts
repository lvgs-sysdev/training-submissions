import { CustomError } from "../errors/customError";
import { STATUS_CODES } from "../constants/statusCode";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class CheckRequiredInput {
  checkRequiredInput = async ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    if (!value) {
      console.log(`[CheckRequiredInput] ${key} が空なのでエラーをスローします`);
      throw new CustomError(
        ERROR_MESSAGES.INPUT_REQUIRED, // 1. message
        STATUS_CODES.VALIDATION_ERROR,
        key // 3. details
      );
    }
  };
}
