import { Router } from "express";
import { deleteUrlById, getUrlsId, getUrlsRedirect, postUrlsShorten } from "../controllers/urlsController.js";

const router = Router();

router.post("/urls/shorten", postUrlsShorten);
router.get("/urls/:id", getUrlsId);
router.get("/urls/open/:shortUrl", getUrlsRedirect);
router.delete("/urls/:id", deleteUrlById);

export default router;