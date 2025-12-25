import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Course service running on port ${PORT}`));
