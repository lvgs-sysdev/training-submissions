import express from "express";
import { LoginController } from "../controllers/loginController";

const router = express.Router();
const controller = new LoginController();

router.get("/", controller.login);

export default router;
