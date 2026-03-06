import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chatController";

const router = Router();
router.use(protectRoute);

// router.post("/register", register);
// router.post("/login", login);
router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat)

export default router;