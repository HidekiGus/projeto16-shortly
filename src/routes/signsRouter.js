import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/signsController.js";

const router = Router();

router.post("/signup", postSignUp);
router.post("/signin", postSignIn);

export default router;