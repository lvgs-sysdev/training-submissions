import { GenericServerError } from "./GenericServerErrorType";
import { ValidationError } from "./ValidationErrorType";

export type ApiErrorResponse = ValidationError | GenericServerError;
