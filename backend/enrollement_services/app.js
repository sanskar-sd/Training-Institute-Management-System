import express from "express";
import dotenv from "dotenv";
import cors from "cors";    
import connectDB from "./db.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";


dotenv.config();
connectDB();

const app=express();
app.use(cors());
app.use(express.json());

// Mount enrollment routes
app.use("/api/enrollments", enrollmentRoutes);

const PORT=process.env.PORT || 8003;
app.listen(PORT,()=>console.log(`Enrollment service running on port ${PORT}`));