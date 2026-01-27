import { Router } from "express";
import { createUser, deleteUser, getAllUser, getUser, updateUser } from "../controllers/user_controller.js";

const router = Router();

router.route('/create-user').post(createUser);
router.route('/get-all-user').get(getAllUser);
router.route('/:id').get(getUser);
router.route('/update-user/:id').put(updateUser);
router.route('/delete-user/:id').delete(deleteUser);

export default router;