import { Router } from "express";
import { postSignUp } from "../controllers/signsController.js";

const router = Router();

router.post("/signup", postSignUp);

export default router;