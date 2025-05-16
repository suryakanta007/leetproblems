import { Router } from "express";
import {register,login,logout,profile} from "../controllers/user.controllers.js"
import {registerValidator} from "../validators/User.validators.js"
import { validate } from "../middlewares/validator.middleware.js";
const router = Router();

router.route("/register").post(registerValidator(),validate,register);
router.route("/login").post(login)


// Protected Routes
router.route("logout").post(logout)
router.route("/profile").get(profile)

export default router;