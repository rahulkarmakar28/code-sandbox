import { Router } from "express";
import { verify } from "../controllers/turnstile.controller";

const router = Router();
router.post("/", verify);

export default router;