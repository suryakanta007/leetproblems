import {body} from "express-validator"


const registerValidator= ()=>{
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
        ]
}

const loginValidator= ()=>{
    return [
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
        ]
}

export {
        registerValidator  ,
        loginValidator 
    }