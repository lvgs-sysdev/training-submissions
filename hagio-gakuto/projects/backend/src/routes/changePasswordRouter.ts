import express from "express";
import { ChangePasswordController } from "../controllers/changePasswordController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();
const controller = new ChangePasswordController();

router.put("/", authenticateToken, controller.changePassword);

export default router;
