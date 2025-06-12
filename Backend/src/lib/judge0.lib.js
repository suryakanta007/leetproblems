import axios from "axios"
import { decodeBase64 } from "bcryptjs"
import { sleep } from "../utils/polingTiming.js"
export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()] 
}   


export const submitBatch = async (submissions)=>{
    // const {data} = await axios.post(`${process.env.SULU_API_URL}/submissions/batch?base64_encoded=false`,{
    //     submissions
    // })


    const {data} = await axios.request({
        method:'POST',
        url:`${process.env.SULU_API_URL}/submissions/batch`,
        params: {base64_encoded: 'false'},
        headers:{
            'Content-Type':'application/json',
            Accept:'application/json',
            Authorization:`Bearer ${process.env.SULU_API_KEY}`
        },
        data:{
            submissions
        }
    })

    console.log("Submission result : ",data);

    return data

}

export const pollBatchResults = async (tokens)=>{
    while(true){
        // const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
        //     params:{
        //         tokens:tokens.join(","),
        //         base64_encoded:false,
        //     }
        // })

        const {data} = await axios.request({
            method:'GET',
            url:`${process.env.SULU_API_URL}/submissions/batch`,
            params: {
                tokens:tokens.join(","),
                base64_encoded: 'false',
            },
            headers:{
                Accept:'application/json',
                Authorization:`Bearer ${process.env.SULU_API_KEY}`
            }
        })

        const results = data.submissions;
        console.log("Batch submission result : ",results)

        const isAllDone = results.every(
            (r)=>r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone){
            return results
        }

        await sleep(1000)
    }
}