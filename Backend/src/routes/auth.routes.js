import { Router } from "express";
import {register,login,logout,profile} from "../controllers/auth.controllers.js"
import {registerValidator,loginValidator} from "../validators/User.validators.js"
import { validate } from "../middlewares/validator.middleware.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerValidator(),validate,register);
router.route("/login").post(loginValidator(),validate,login);


// Protected Routes
router.route("/logout").post(authMiddleware,logout)
router.route("/profile").get(authMiddleware,profile)

export default router;