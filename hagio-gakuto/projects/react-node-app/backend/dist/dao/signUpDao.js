"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpDao = void 0;
const client_1 = require("../db/client");
class SignUpDao {
    signUp = async (email, password) => {
        await client_1.pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
            email,
            password,
        ]);
    };
    isEmailExists = async (email) => {
        return await client_1.pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM users 
      WHERE email = $1
    )
  `, [email]);
    };
}
exports.SignUpDao = SignUpDao;
