import { Router } from "express";
import { getUsersMe } from "../controllers/usersController.js";

const router = Router();

router.get("/users/me", getUsersMe);

export default router;