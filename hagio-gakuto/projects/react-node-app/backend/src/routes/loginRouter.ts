import express from "express";
import { LoginController } from "../controllers/loginController";

const router = express.Router();
const controller = new LoginController();

router.post("/", controller.login);

export default router;
