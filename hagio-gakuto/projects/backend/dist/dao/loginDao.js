"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDao = void 0;
const client_1 = require("../db/client");
const User_1 = require("../models/User");
class LoginDao {
    async findUserByEmail(email) {
        const result = await client_1.pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        // ユーザーが存在しない場合はnullを返す
        if (result.rows.length === 0) {
            return null;
        }
        // 取得したデータをUserオブジェクトに変換して返す
        const u = result.rows[0];
        return new User_1.User(u.id, u.name, u.email, u.password);
    }
}
exports.LoginDao = LoginDao;
