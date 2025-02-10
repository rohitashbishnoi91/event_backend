import express from "express";
import { register, login } from "../controllers/authController.js";
import { guestLogin } from "../controllers/authController.js";




const router = express.Router();

router.post("/guest-login", guestLogin);

// Route: POST /api/auth/register
router.post("/register", register);

// Route: POST /api/auth/login
router.post("/login", login);

export default router;
