"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const signUpService_1 = require("../services/signUpService");
class SignUpController {
    service = new signUpService_1.SignUpService();
    signUp = async (req, res) => {
        await this.service.signUp(req.body);
        res.status(201).json({ message: "登録成功" });
    };
}
exports.SignUpController = SignUpController;
