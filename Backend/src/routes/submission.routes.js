import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllSubmission, getSubmissionForProblem, getTotalSubmissionForProblem } from "../controllers/submission.controllers.js";

const router = Router();


router.route("/get-all-submissions").get(authMiddleware,getAllSubmission);
router.route("get-submission/:problmId").get(authMiddleware,getSubmissionForProblem);
router.route("/get-submissions-count/:problemId").get(authMiddleware,getTotalSubmissionForProblem)



export default router;