import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-error.js";
import {db} from "../db/db.js";
import { UserRole } from "../generated/prisma/index.js";


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return next(new ApiError(401, "Unauthorized"));
        }
        let decoded
        try {
             decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return next(new ApiError(401, "Unauthorized- Invalid token"));
        }


        const user = await db.user.findUnique({
            where: {
                id: String(decoded.id)
            },
            select:{
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            }
        });


        if(!user){
            return next(new ApiError(401, "User not found."));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ApiError(401, error,"Unauthorized"));
    }

}
export const checkAdmin = async(req,res,next)=>{
        try {
            const userId = req.user.id;
            const user = await db.user.findUnique({
                where:{
                    id:userId
                },
                select:{
                    role:true
                }
            })

            if(!user){
                return next(new ApiError(500,"User not able find from Database.Please try again."))
            }

            if(user.role !== UserRole.ADMIN){
                return next(new ApiError(403,"You are not authorized to perform this action."))
            }
            next();

        } catch (error) {
            return next(new ApiError(500,"Error while checking admin."));
        }
}