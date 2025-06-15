import { db } from "../db/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asysns-handler.js";

const getAllSubmission = asyncHandler(async (req,res,next)=>{
    const userId = req.user.id;
    try {
        const submission = await db.submission.findMany({
            where:{
                userId
            }
        })
        
        if(!submission){
            return next(new ApiError(404,"Submission is not able to find from DB."))
        }

        return res.status(200).json(new ApiResponse(200,submission,"All submission Featched successfuly."))
    } catch (error) {
        return next(new ApiError(500,error,"Error while featching all submission of user."))
    }
})



const getSubmissionForProblem = asyncHandler(async (req,res,next)=>{

})

const getTotalSubmissionForProblem = asyncHandler(async (req,res,next)=>{

})


export {getAllSubmission,getSubmissionForProblem,getTotalSubmissionForProblem}