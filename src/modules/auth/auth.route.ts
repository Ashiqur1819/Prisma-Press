import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

export const userRouter = router;
