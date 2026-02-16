"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRequiredInput = void 0;
const customError_1 = require("../errors/customError");
const statusCode_1 = require("../constants/statusCode");
const errorMessages_1 = require("../constants/errorMessages");
class CheckRequiredInput {
    checkRequiredInput = async ({ key, value, }) => {
        if (!value) {
            console.log(`[CheckRequiredInput] ${key} が空なのでエラーをスローします`);
            throw new customError_1.CustomError(errorMessages_1.ERROR_MESSAGES.INPUT_REQUIRED, // 1. message
            statusCode_1.STATUS_CODES.VALIDATION_ERROR, key // 3. details
            );
        }
    };
}
exports.CheckRequiredInput = CheckRequiredInput;
