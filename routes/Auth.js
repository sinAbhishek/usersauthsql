import { login, register, resetPassword } from "../controller/Auth.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/resetpassword", resetPassword);

export default router;
