import { Router } from "express";
import { createUser, deleteUser, getAllUser, getUser, updateUser } from "../controllers/user_controller.js";
// import { login, logout } from "../auth/auth.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route('/create-user').post(createUser);
// router.route('/login').post(login);
// router.route('/logout').post(auth,logout);

router.route('/get-all-user').get(getAllUser);
router.route('/me').get(auth,getUser);
router.route('/update-user/:id').put(auth,upload.fields([{name:"avatar", maxCount:1}]),updateUser);
router.route('/delete-user/:id').delete(deleteUser);

export default router;