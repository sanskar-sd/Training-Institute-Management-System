import express from "express";
import { getStudentTimetable } from "../controllers/timetableController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/student/:studentId", authMiddleware,getStudentTimetable);

export default router;