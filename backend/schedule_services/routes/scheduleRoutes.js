import express from "express";
import { authMiddleware } from "../../enrollement_services/middlewares/authMiddleware.js";
import { createSchedule, getAllSchedules, getScheduleByCourse } from "../controllers/scheduleController.js";


const router=express.Router();


router.post("/",authMiddleware,createSchedule);
router.get("/",authMiddleware,getAllSchedules);
router.get("/course/:courseId",authMiddleware,getScheduleByCourse);

export default router;