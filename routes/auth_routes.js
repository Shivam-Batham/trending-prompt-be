import { Router } from "express";
import { login, logout, me, refreshSession } from "../controllers/auth_controller.js";
import { auth } from "../middleware/auth.js";

const router =  Router();

router.route("/login").post(login);
router.route("/refresh").post(refreshSession);
router.route("/me").get(auth, me);
router.route("/logout").post(logout);

export default router;