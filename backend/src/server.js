import express from "express";
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { functions,inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

dotenv.config();

const app=express();
app.use(express.json());

app.use(clerkMiddleware());//req.auth will be avialble in the request object

app.use("/api/inngest" , serve({ client:inngest, functions }));

app.get("/",(req,res)=>{
    res.send("hello World");
})

const startServer=async ()=>{
    try{
        await connectDB();
        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT, () =>{
                console.log("Server started on port: ",ENV.PORT);
            });
        }
    }catch (error){
        console.error("Error starting server:",error);
        process.exit(1);
    }
};

startServer();

export default app;