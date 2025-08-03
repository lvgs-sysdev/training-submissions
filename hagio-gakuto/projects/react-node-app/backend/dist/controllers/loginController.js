"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const loginService_1 = require("../services/loginService");
class LoginController {
    service = new loginService_1.LoginService();
    login = async (req, res) => {
        await this.service.login(req.body);
        res.json({ message: "認証成功" });
    };
}
exports.LoginController = LoginController;
