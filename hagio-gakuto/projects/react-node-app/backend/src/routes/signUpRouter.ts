import express from "express";
import { SignUpController } from "../controllers/signUpController";

const router = express.Router();
const controller = new SignUpController();

router.post("/", controller.signUp);

export default router;
