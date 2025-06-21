import express from "express"
import userRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoutes from "./routes/execution-code.routes.js"
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/palylist.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser"
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use( 
    cors({
        origin:'http://localhost:5173',
        credentials:true
    })
)

app.get("/",(req,res)=>{
    res.send("Hello , Wellcome to LeetLab.❤️‍🔥")
})

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/problems",problemRoutes);
app.use("/api/v1/execute-code",executionRoutes);
app.use("/api/v1/submission",submissionRoutes);
app.use("/api/v1/playlist",playlistRoutes);
app.use(errorHandler);

export default app;