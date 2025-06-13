import { Router } from "express";
import {authMiddleware,checkAdmin} from "../middlewares/auth.middleware.js";
import {createProblem,deleteProblem,getAllProblems, getAllSolvedProblemsByUser, getProblemById, updateProblem} from "../controllers/problems.controllers.js";

const router  = Router();

router.route("/create-problem").post(authMiddleware,checkAdmin,createProblem);
router.route("/").get(authMiddleware,getAllProblems);
router.route("/get-problem/:id").get(authMiddleware,getProblemById);
router.route("/update-problem/:id").put(authMiddleware,checkAdmin,updateProblem);
router.route("/delete-problem/:id").delete(authMiddleware,checkAdmin,deleteProblem);
router.route("/get-solved-problems").get(authMiddleware,getAllSolvedProblemsByUser);




export default router;