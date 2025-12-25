import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';

connectDB();

const app=express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);

const PORT=process.env.PORT||8001;
app.listen(PORT,()=>{
    console.log(`Auth server running on port ${PORT}`);
});