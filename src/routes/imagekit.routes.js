import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getImagekitAuth } from "../controllers/imagekit.controller.js";

const router = Router()

router.get('/imagekit-auth',authMiddleware,getImagekitAuth)

export default router