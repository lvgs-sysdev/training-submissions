"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    name;
    email;
    password_hash;
    constructor(id, name, email, password_hash) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
    }
}
exports.User = User;
