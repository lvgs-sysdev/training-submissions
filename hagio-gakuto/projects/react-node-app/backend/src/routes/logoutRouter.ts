import express from "express";
import { LogoutController } from "../controllers/logoutController";

const router = express.Router();
const controller = new LogoutController();

router.post("/", controller.logout);

export default router;
