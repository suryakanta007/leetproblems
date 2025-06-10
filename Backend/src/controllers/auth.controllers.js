import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asysns-handler.js";
import bcrypt from "bcryptjs";
import { db } from "../db/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";


const register = asyncHandler(async (req, res, next) => {
    const { email, name, password } = req.body;

    const isUserPresent = await db.user.findUnique({
        where: {
            email
        }
    })

    if (isUserPresent) {
        next(new ApiError(400, "User already exists"));
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
        data: {
            email,
            password: hashedPassowrd,
            name,
            role: UserRole.USER
        }
    })

    if (!newUser) {
        next(new ApiError(500, "User not created in DB."))
    }

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(201).json(new ApiResponse(201, newUser, "User created successfully."));
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
        where: {
            email
        }
    })
    console.log(user)

    if (!user) {
        next(new ApiError(404, "User not Found."))
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        next(new ApiError(401, "Invalid credentials"))
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(200).json(new ApiResponse(200, user, "User login successfully."));

})

const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    })

    res.status(200).json(new ApiResponse(204, "User Logout successfully."))

})

const profile = asyncHandler(async (req, res, next) => {
        return res.status(200).json(new ApiResponse(200,req.user,"User Authenticated Successfully."))
})  


export { register, login, logout, profile }
