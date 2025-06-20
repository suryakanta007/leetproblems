import { asyncHandler } from "../utils/asysns-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../db/db.js";


const getAllListDetails = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    try {
        const allPlaylists = await db.playlist.findMany({
            where: {
                userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        if (!allPlaylists) {
            return next(new ApiError(500, "Can't get playlist from the database."))
        }

        return res.status(200).json(new ApiResponse(200, allPlaylists, "All palylist details featched successfuly."))

    } catch (error) {
        return next(new ApiError(500, error, "Error while geting Allpalylist."))
    }

})

const getPlayListDetails = asyncHandler(async (req, res, next) => {
    const { playlistId } = req.params;
    const userId = req.user.id;
    try {
        const playlistDetails = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        if (!playlistDetails) {
            return next(new ApiError(400, "Not found playlist details."))
        }

        return res.status(200).json(new ApiResponse(200, playlistDetails, "All the playlist details feached."))

    } catch (error) {
        return next(new ApiError(500, error, "Error while geting playlist details."))
    }

})

const createPlaylist = asyncHandler(async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        //TODO
        if (!name || !description) {
            return next(new ApiError(402, "Name and description is mandotory."))
        }
        
        const isPresent = await db.playlist.findUnique({
            where: {
                name_userId: {
                    name,
                    userId
                }
            }
        })
        

        if (isPresent) {
            return next(new ApiError(402, "Playlist is already created."))
        }


        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        })
        if (!playlist) {
            return next(new ApiError(500, "Playlist is not able to create in database."))
        }

        res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))

    } catch (error) {
        return next(new ApiError(500, error, "Error while creating palylist."))
    }
})

const addProblemToPlaylist = asyncHandler(async (req, res, next) => {
    const { playListId } = req.params;
    const { problemIds } = req.body;
    try {
        
       
        
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return next(new ApiError(402, "Invalid or missing problems."))
        }

        const newProblemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playListId,
                problemId
            }))
        })
        if (!newProblemsInPlaylist) {
            return next(new ApiError(500,"Problems are not able to add in the playlist."))
        }
        return res.status(200).json(new ApiResponse(200,newProblemsInPlaylist,"added problems in playlist"))
    } catch (error) {
        return next(new ApiError(500, error, "Error while adding problem in playlist."))
    }
})

const deletePlaylist = asyncHandler(async (req, res, next) => {
    const {playListId} = req.params;
    try {
        
        const isPresent = await db.playlist.findUnique({
            where:{
                id:playListId
            }
        })
        console.log("Ok : ",isPresent);
        if(!isPresent){
            return next(new ApiError(404,"This playlist is not exist."))
        }

       
        

        const deletedPlayList = await db.playlist.delete({
            where:{
                id:playListId
            }
        })
        if(!deletedPlayList){
            return next(new ApiError(500,"Playlist is not delete from the database."))
        }
        return res.status(200).json(new ApiResponse(200,deletedPlayList,"Delete the playlist is Sucessfully."));
    } catch (error) {
        return next(new ApiError(500, error, "Error while deleting playlist."))
    }
})

const removeProblemFromPlaylist = asyncHandler(async (req, res, next) => {
    const {playListId} = req.params;
    const {problemIds} = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return next(new ApiError(402, "Invalid or missing problems."))
        }

        const deletedProblems = await db.problemInPlaylist.deleteMany({
            where:{
                playListId,
                problemId:{
                    in:problemIds
                }
            }
        })
        if(!deletedProblems){
            return next(new ApiError(500,"No problem is deleted from the playlist."))
        }
        return res.status(200).json(new ApiResponse(200,deletedProblems,"Problems deleted from the playlist successfully."))
    } catch (error) {
        return next(new ApiError(500, error, "Error while deleting problem from playlist."))
    }
})


export { getAllListDetails, getPlayListDetails, createPlaylist, addProblemToPlaylist, deletePlaylist, removeProblemFromPlaylist }