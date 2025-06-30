import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {toast} from 'react-hot-toast'
import { AwardIcon } from 'lucide-react'

export const  useProblemStore  = create((set)=>({
    problems:[],
    problem:null,
    solvedProblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,

    getAllProblems:async ()=>{
        try {
            set({isProblemsLoading:true})
            const res = await axiosInstance.get("/problems/");
            set({problems:res.data.data});
        } catch (error) {
            console.log("Error geting all Problems: ",error);
            toast.error("Error in geting problems")
        }
        finally{
            set({isProblemsLoading:false})
        }
    },
    getProblemById:async(id)=>{
        try {
            set({isProblemsLoading:true})
            const res = await axiosInstance.get(`/problems/get-problem/${id}`)
            set({problem:res.data.data})
        } catch (error) {
            console.log("Erro in getProblemById ",error);
            toast.error("Error in getProblemById .")
            
        }finally{
            set({isProblemsLoading:false})
        }
    },

    getSolvedProblemByUser :async ()=>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problems")

            set({solvedProblems:res.data.data});
            toast.success(res.data.message||"Solved Problems are fetched successfully.");
        } catch (error) {
            console.log("Error in getSolvedProblemByUser ",error);
            toast.error("Error in getSolvedProblemByUser .")
        }
    }

    



})) 