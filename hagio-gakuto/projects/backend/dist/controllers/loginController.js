"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const loginService_1 = require("../services/loginService");
class LoginController {
    service = new loginService_1.LoginService();
    login = async (req, res) => {
        const { email, password } = req.body;
        const token = await this.service.login(email, password);
        if (!token) {
            return res.status(401).json({ message: "認証失敗" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.json({ message: "ログイン成功" });
    };
}
exports.LoginController = LoginController;
