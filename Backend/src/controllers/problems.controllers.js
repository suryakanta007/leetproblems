import { asyncHandler } from "../utils/asysns-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRole } from "../generated/prisma/index.js";
import { getJudge0LanguageId,submitBatch,pollBatchResults } from "../lib/judge0.lib.js";
import { db } from "../db/db.js";


const createProblem = asyncHandler(async(req,res,next)=>{
    // Going to get all the data from the req.body
    const {title,description,defficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolution } =  req.body;

    if(req.user.role!==UserRole.ADMIN){
        return next(new ApiError(403,"You are not authorized to perform this action."))
    }

    try {
        for(const [language,solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                return next(new ApiError(400,`Language ${language} is not supported.`))
            }

            const submissions = testcases.map(({input,output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }))

            const submissionResults= await submitBatch(submissions) ;

            const  tokens = submissionResults.map((res)=>res.token);
            // create a polling that will check the status of the submissions 
            const  results = await pollBatchResults(tokens);

            for(let i = 0;i<results.length;i++){
                const result = results[i];

                console.log("Result : ",result)

                if(result.status.id !== 3){
                    return next(new ApiError(400,`Testcase ${i+1} failed for language ${language}`));
                }
            }

            // Save the problem to the database .

            const newProblem = await db.problem.create({
                data:{
                    title,description,defficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolution,
                    userId:req.user.id,
                }
            })

            if(!newProblem){
                return next(new ApiError(500,"Problem is not able to create in the database."))
            }

            return res.status(201).json(new ApiResponse(201,newProblem,"new Problem is created succesfully."))

        }
    } catch (error) {
        return next(new ApiError(500,error,"error while creating the problem."))
    }
})

const getAllProblems = asyncHandler(async(req,res,next)=>{
    try {
        const problems = await db.problem.findMany();
        if(!problems){
            return next(new ApiError(500,"Problem is not able to fetch from the database."))
        }

        return res.status(200).json(new ApiResponse(201,problems,"Problems are fetched successfully."))

    } catch (error) {
        return next(new ApiError(500,error,"error while featching the problems."));
    }
})

const getProblemById = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    try {
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })
        
        if(!problem){
            return next(new ApiError(404,"Problem is not found."))
        }

        return res.status(200).json(new ApiResponse(200,problem,"Problem is fetched successfully."));

    } catch (error) {
        return next(new ApiError(500,error,"error while featching the problem."))
    }
})

const updateProblem = asyncHandler(async(req,res,next)=>{ 
    
});

const deleteProblem = asyncHandler(async(req,res,next)=>{ 

});

const getAllSolvedProblemsByUser = asyncHandler(async(req,res,next)=>{ 

});


export {createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem,getAllSolvedProblemsByUser};