import { Router } from "express";
import { fetchFeed } from "../controllers/feed_controller.js";

const router = Router();

router.route("/").get(fetchFeed);

export default router;