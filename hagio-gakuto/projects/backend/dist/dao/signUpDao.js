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
}
exports.SignUpDao = SignUpDao;
