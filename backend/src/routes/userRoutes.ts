import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

const router = Router();

// router.post("/register", register);
// router.post("/login", login);

router.get("/", protectRoute, getUsers)

export default router;