import express from "express"
import userRoutes from "./routes/auth.routes.js"
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello , Wellcome to LeetLab.❤️‍🔥")
})

app.use("/api/v1/auth",userRoutes);
app.use(errorHandler);

export default app;