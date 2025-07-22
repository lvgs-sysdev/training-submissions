"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const customError_1 = require("../errors/customError");
const checkRequiredInput_1 = require("../utils/checkRequiredInput");
const errorMessages_1 = require("../constants/errorMessages");
const statusCode_1 = require("../constants/statusCode");
const loginDao_1 = require("../dao/loginDao");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginService {
    dao = new loginDao_1.LoginDao();
    checkRequiredInput = new checkRequiredInput_1.CheckRequiredInput();
    login = async (data) => {
        await this.validateInputs(data);
        await this.executeLogin(data);
    };
    validateInputs = async (data) => {
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
    executeLogin = async (data) => {
        const { email, password } = data;
        const user = await this.findUser(email);
        console.log(user);
        await this.comparePasswordAndHashedPassword(password, user.hashedPassword);
        // 認証成功後、JWTを生成
        const token = await this.generateToken(user.id, user.name);
        console.log(token);
        return token;
    };
    findUser = async (email) => {
        const user = await this.dao.findUserByEmail(email);
        if (!user) {
            throw new customError_1.CustomError(errorMessages_1.ERROR_MESSAGES.LOGIN_FAILED, // 1. message
            statusCode_1.STATUS_CODES.UNAUTHORIZE);
        }
        return user;
    };
    comparePasswordAndHashedPassword = async (password, hashedPassword) => {
        const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
        if (!isMatch) {
            throw new customError_1.CustomError(errorMessages_1.ERROR_MESSAGES.LOGIN_FAILED, // 1. message
            statusCode_1.STATUS_CODES.UNAUTHORIZE);
        }
    };
    generateToken = async (id, name) => {
        const payload = { userId: id, name: name };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10), // トークンの有効期限
        });
        return token;
    };
}
exports.LoginService = LoginService;
