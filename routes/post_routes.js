import { Router } from "express";
import { createPost, deleteAllPosts, deletePost, getAllPosts, getPost, updateAllPosts, updatePost } from "../controllers/post_controller.js";

const router =  Router();

router.route('/create-post').post(createPost);
router.route('/get-post/:id').get(getPost);
router.route('/get-posts').get(getAllPosts);
router.route('/update-post/:id').put(updatePost);
router.route('/update-all-posts').put(updateAllPosts);
router.route('/delete-post').delete(deletePost);
router.route('/delete-all-posts').delete(deleteAllPosts);

export default router;
