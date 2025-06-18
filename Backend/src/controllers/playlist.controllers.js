import { asyncHandler } from "../utils/asysns-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../db/db.js";


const getAllListDetails =asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    try {
        const allPlaylists = await db.playlist.findMany({
            where:{
                userId
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        if(!allPlaylists){
            return next(new ApiError(500,"Can't get playlist from the database."))
        }

        return res.status(200).json(new ApiResponse(200,allPlaylists,"All palylist details featched successfuly."))

    } catch (error) {
        return next(new ApiError(500,error,"Error while geting Allpalylist."))
    }
    
})

const getPlayListDetails = asyncHandler(async(req,res,next)=>{
})

const createPlaylist = asyncHandler(async(req,res,next)=>{
    try {
        const {name,description}=req.body;
        const userId = req.user.id;

        //TODO
        if(!name||!description){
            return next(new ApiError(402,"Name and description is mandotory."))
        }
        const isPresent = await db.playlist.findUnique({
            where:{
                name,
                description
            }
        })
        if(!isPresent){
            return next(new ApiError(402,"Playlist is already created."))
        }
        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        })
        if(!playlist){
            return next(new ApiError(500,"Playlist is not able to create in database."))
        } 

        res.status(200).json(new ApiResponse(200,playlist,"Playlist created successfully"))

    } catch (error) {
        return next(new ApiError(500,error,"Error while creating palylist."))
    }
})

const addProblemToPlaylist = asyncHandler(async(req,res,next)=>{
    
})  

const deletePlaylist = asyncHandler(async(req,res,next)=>{
    
})

const removeProblemFromPlaylist = asyncHandler(async(req,res,next)=>{
    
})


export {getAllListDetails,getPlayListDetails,createPlaylist,addProblemToPlaylist,deletePlaylist,removeProblemFromPlaylist}