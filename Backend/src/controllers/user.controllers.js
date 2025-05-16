import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asysns-handler.js";
import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"


const register  = asyncHandler(async(req,res,next)=>{
    const {email,name,password} = req.body;

    const isUserPresent = await db.user.findUnique({
        where : {
            email 
        }
    })

    if(isUserPresent){
        next(new ApiError(400,"User already exists"));
    }

    const hashedPassowrd = await bcrypt.hash(password,10);

    const newUser = await db.user.create({
        data:{
            email,
            password:hashedPassowrd,
            name,
            role: UserRole.USER
        }
    })

    if(!newUser){
        next(new ApiError(500,"User not created in DB."))
    }

    const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});



})

const login = asyncHandler(async(req,res,next)=>{

})

const logout = asyncHandler(async(req,res,next)=>{

})

const profile = asyncHandler(async(req,res,next)=>{

})


export {register,login,logout,profile}
