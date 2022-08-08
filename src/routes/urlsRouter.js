import { Router } from "express";
import { getUrlsId, postUrlsShorten } from "../controllers/urlsController.js";

const router = Router();

router.post("/urls/shorten", postUrlsShorten);
router.get("/urls/:id", getUrlsId);

export default router;