import express from "express";
import { checkAuth, login, logout, signup, updateprofile } from "../controllers/authController.js";

import { protectRoute} from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateprofile);

router.get("/check", protectRoute, checkAuth);

export default router;