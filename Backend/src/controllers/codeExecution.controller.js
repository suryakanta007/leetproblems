import { asyncHandler } from "../utils/asysns-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { submitBatch,pollBatchResults } from "../lib/judge0.lib.js";

const executeCode = asyncHandler(async(req,res,next)=>{
    const {source_code,language_id,stdin,expected_outputs,problemId} = req.body;
    const userId = req.user.id;

    try {
        // Vlaidate TestCases
        if(
            !Array.isArray(stdin)||
            stdin.length===0||
            !Array.isArray(expected_outputs)||
            expected_outputs.length!==stdin.length
        ){
            return next(new ApiError(400,"Invalid or missing Test Cases."));
        }
        // Prepare each testcases for Judge0 batch submission
        const submissions = stdin.map((input)=>(
            {
                source_code,
                language_id,
                stdin:input,
            }
        ))

        // 3.Send this Batch of submission to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=>res.token);

        // 4. Create a polling that will get the status and result of the submissions 
        const results = await pollBatchResults(tokens);

        res.status(200).json(new ApiResponse(200,"Code is executed successfully."));        



    } catch (error) {
        return next(new ApiError(500,error,"Error while executing the code."))
    }
})


export {executeCode}