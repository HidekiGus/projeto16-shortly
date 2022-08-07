import { Router } from "express";
import { postUrlsShorten } from "../controllers/urlsController.js";

const router = Router();

router.post("/urls/shorten", postUrlsShorten);

export default router;