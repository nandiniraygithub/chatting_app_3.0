import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message_controller.js"; // Correct import

const router = express.Router();

// Define the routes
router.get("/users", protectRoute, getUsersForSidebar);  // Corrected function name
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
