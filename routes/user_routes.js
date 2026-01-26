import { Router } from "express";
import { createUser, deleteUser, getAllUser, getUser, updateUser } from "../controllers/user_controller.js";

const router = Router();

router.route('/').get(getUser);
router.route('/get-all-user').get(getAllUser);
router.route('/create-user').post(createUser);
router.route('/update-user').put(updateUser);
router.route('/delete-user').delete(deleteUser);

export default router;