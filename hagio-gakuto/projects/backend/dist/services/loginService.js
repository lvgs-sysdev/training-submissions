"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
const loginDao_1 = require("../dao/loginDao");
class LoginService {
    dao = new loginDao_1.LoginDao();
    secret = "your-secret-key";
    async login(email, password) {
        // const user = await this.dao.findUserByEmail(email);
        // if (!user) return null;
        // const isMatch = await bcrypt.compare(password, user.password_hash);
        // if (!isMatch) return null;
        // const token = jwt.sign({ id: user.id, email: user.email }, this.secret, {
        //   expiresIn: "1h",
        // });
        return "abj";
    }
}
exports.LoginService = LoginService;
