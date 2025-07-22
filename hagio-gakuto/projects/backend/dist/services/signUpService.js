"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUpDao_1 = require("../dao/signUpDao");
const customError_1 = require("../errors/customError");
const checkRequiredInput_1 = require("../utils/checkRequiredInput");
const errorMessages_1 = require("../constants/errorMessages");
const statusCode_1 = require("../constants/statusCode");
class SignUpService {
    dao = new signUpDao_1.SignUpDao();
    checkRequiredInput = new checkRequiredInput_1.CheckRequiredInput();
    signUp = async (data) => {
        const { email, password } = data;
        await this.validateInputs(data);
        const hashed = await bcrypt_1.default.hash(password, 10);
        await this.dao.signUp(email, hashed);
    };
    validateInputs = async (data) => {
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
            throw new customError_1.CustomError(errorMessages_1.ERROR_MESSAGES.PASSWORD_MISMATCH, statusCode_1.STATUS_CODES.VALIDATION_ERROR, "confirmPassword");
        }
    };
}
exports.SignUpService = SignUpService;
