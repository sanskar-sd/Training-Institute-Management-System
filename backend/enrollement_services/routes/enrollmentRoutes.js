import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { bulkEnrollStudents, enrollStudent, getStudentCourses, getAllEnrollments } from "../controllers/enrollmentController.js";
import { get } from "mongoose";


const router=express.Router();

router.post("/",authMiddleware,enrollStudent);
router.post("/bulk",authMiddleware,bulkEnrollStudents);
router.get("/student/:studentId",authMiddleware,getStudentCourses);
router.get("/", authMiddleware, getAllEnrollments);


export default router;