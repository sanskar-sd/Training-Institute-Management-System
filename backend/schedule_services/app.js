import express from "express";
import dotenv from "dotenv";
import cor from "cors";
import connectDB from "./db.js";


dotenv.config();
connectDB();

const app=express();
app.use(cor());
app.use(express.json());

app.use("/api/schedules",scheduleRoutes);

const PORT=process.env.PORT || 8004;
app.listen(PORT,()=>console.log(`Schedule service running on port ${PORT}`));import scheduleRoutes from "./routes/scheduleRoutes.js";