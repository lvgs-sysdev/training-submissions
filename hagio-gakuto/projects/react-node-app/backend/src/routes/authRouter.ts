import express, { Request, Response } from "express"; // 修正点
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.get("/me", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json(req.user);
});

export default router;
