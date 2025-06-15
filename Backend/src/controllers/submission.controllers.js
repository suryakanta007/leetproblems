import { db } from "../db/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asysns-handler.js";

const getAllSubmission = asyncHandler(async (req,res,next)=>{
    const userId = req.user.id;
    try {
        const submissions = await db.submission.findMany({
            where:{
                userId
            }
        })
        
        if(!submissions){
            return next(new ApiError(404,"Submission is not able to find from DB."))
        }

        return res.status(200).json(new ApiResponse(200,submissions,"All submission Featched successfuly."))
    } catch (error) {
        return next(new ApiError(500,error,"Error while featching all submission of user."))
    }
})



const getSubmissionForProblem = asyncHandler(async (req,res,next)=>{

    const userId = req.user.id;
    const {problemId} = req.params;
    try {
        const submissions =await db.submission.findMany({
            where:{
                problemId,
                userId
            }
        })

        if(!submissions){
            return next(new ApiError(404,"Submissions for the problem is not able to find from DB."))
        }

        console.log(submissions)

        return res.status(200).json(new ApiResponse(200,submissions,"All submissions are featched successfully."))

    } catch (error) {
        return next(new ApiError(500,error,"Error while featching all submission of user for this problem."))
    }

})

const getTotalSubmissionForProblem = asyncHandler(async (req,res,next)=>{
    const {problemId} = req.params;
    try {
        const submissionCount = await db.submission.count({
            where:{
                problemId
            }
        })
        
        if(!submissionCount){
            return next(new ApiError(400,"Submission not able count in the database ."))
        }

        return res.status(200).json(new ApiResponse(200,submissionCount,"Successfully count all submission."))
    } catch (error) {
        return next(new ApiError(500,error,"Error while counting all submission of user for this problem."))
    } 
})


export {getAllSubmission,getSubmissionForProblem,getTotalSubmissionForProblem}