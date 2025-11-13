import { registerUser, loginUser, requestPasswordReset, resetPassword } from "../Controllers/AuthController.js";
import express from "express";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
