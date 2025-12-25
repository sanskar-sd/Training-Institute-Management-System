import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import timetableRoutes from "./routes/timetableRoutes.js";


console.log("Enrollment URL:", process.env.ENROLLMENT_SERVICE_URL);
console.log("Schedule URL:", process.env.SCHEDULE_SERVICE_URL);


connectDB();

const app=express();
app.use(cors());
app.use(express.json());

// Mount timetable routes
app.use("/api/timetable", timetableRoutes);

const PORT=process.env.PORT || 8005;
app.listen(PORT,()=>console.log(`Timetable service running on port ${PORT}`));