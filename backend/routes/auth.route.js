import { Router } from "express";
const router = Router();
import { signUp, signIn, logOut, varifyEmail } from "../controllers/auth.controller.js";

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/logout', logOut)

router.post('/varify-email', varifyEmail)

export default router;