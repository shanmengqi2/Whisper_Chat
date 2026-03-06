import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages } from "../controllers/messageController";

const router = Router();

// router.post("/register", register);
// router.post("/login", login);
router.get("/chat/:chatId", protectRoute, getMessages)

export default router;