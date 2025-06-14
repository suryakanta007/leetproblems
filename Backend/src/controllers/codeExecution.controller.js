import { asyncHandler } from "../utils/asysns-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { submitBatch, pollBatchResults, getLanguageName } from "../lib/judge0.lib.js";
import { db } from "../db/db.js";

const executeCode = asyncHandler(async (req, res, next) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    try { // Vlaidate TestCases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return next(new ApiError(400, "Invalid or missing Test Cases."));
        }
        // Prepare each testcases for Judge0 batch submission
        const submissions = stdin.map((input) => (
            {
                source_code,
                language_id,
                stdin: input,
            }
        ))

        // 3.Send this Batch of submission to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        // 4. Create a polling that will get the status and result of the submissions 
        const results = await pollBatchResults(tokens);

        // 5. Need anlyasie the result of each submission
        let allPassed = true;

        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            if (!passed) allPassed = false;

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compileOutput: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,
            }
        })

        console.log("Detailed Results : ", detailedResults)
        // 6.Store the submission summary in db.
        const submission = await db.submission.create({
            data:{
                userId,
                problemId,
                sourceCode:source_code,
                language:getLanguageName(language_id),
                stdin:stdin.join("\n"),
                stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
                stderr:detailedResults.some((r)=>r.stderr)?JSON.stringify(detailedResults.map((r)=>r.stderr)):null,

                compileOutput:detailedResults.some((r)=>r.compileOutput)?JSON.stringify(detailedResults.map((r)=>r.compileOutput)):null,

                status:allPassed?"Accepted":"Wrong Answer",
                memory:detailedResults.some((r)=>r.memory)?JSON.stringify(detailedResults.map((r)=>r.memory)):null,
                time:detailedResults.some((r)=>r.time)?JSON.stringify(detailedResults.map((r)=>r.time)):null,
            }
        })

        console.log("Submission : ", submission)

        if(!submission){
            return next(new ApiError(500, "Error while saving the submission."))
        }

        //7. If all passed mark as done for user
        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId,problemId
                    }
                },
                update:{},
                create:{
                    userId,problemId
                }
            })
        }

        //8. Save the indivisual test case results using details Results.

        const testCaseResults = detailedResults.map((result)=>{
            return {
                submissionId:submission.id,
                testCase:result.testCase,
                passed:result.passed,
                stdout:result.stdout,
                expected:result.expected,
                stderr:result.stderr,
                compileOutput:result.compileOutput,
                status:result.status,
                memory:result.memory,
                time:result.time
            }
        })

        const isCreated = await db.testCaseResult.createMany({
            data:testCaseResults
        })

        if(!isCreated){
            return next(new ApiError(500, "Error while saving the test case results."))
        }

        const submissionWithTestCase = await db.submission.findUnique({
            where:{id:submission.id},
            include:{testCases:true}
        })

        res.status(200).json(new ApiResponse(200, submissionWithTestCase,"Code is executed successfully."));
    } catch (error) {
        return next(new ApiError(500, error, "Error while executing the code."))
    }
})


export { executeCode }