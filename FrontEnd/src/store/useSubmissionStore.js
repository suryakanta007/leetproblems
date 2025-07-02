import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { AwardIcon } from "lucide-react"

export const useSubmissionStore = create((set)=>({
    isLoading : false,
    submissions:[],
    submission:null,
    submissionCount:null,

    getAllSubmissions:async()=>{
        try {
            set({isLoading:true})
            const res = await axiosInstance.get("/submissions/get-all-submissions");

            set({submissions:res.data.data})
            toast.success(res.data.message)

        } catch (error) {
            console.log("Error in geting allSubmission: ",error)
            toast.error("Error in geting allSubmission")
        }
        finally{
            set({isLoading:false})
        }
    },

    getSubmissionForProblem:async(problemId)=>{
        try {
            const res = await axiosInstance.get(`/submissions/get-submission/${problemId}`);
            set({submission:res.data.data})
            
        } catch (error) {
            console.log("Error in submission .",error)
            toast.error('Error in submission .')
        }
    },


    getSubmissionCountForProblem:async(problemId)=>{
        try {
            const res = await axiosInstance.get(`/submissions/get-submissions-count/${problemId}`);
            set({submissionCount:res.data.data});

        } catch (error) {
            console.log("Error in geting submission count for problem :" ,error)
        }
    }
}))