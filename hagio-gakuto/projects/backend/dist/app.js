"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const loginRouter_1 = __importDefault(require("./routes/loginRouter"));
const signUpRouter_1 = __importDefault(require("./routes/signUpRouter"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
// 簡単なAPI（認証付き）
app.use("/api/login", loginRouter_1.default);
app.use("/api/signup", signUpRouter_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
