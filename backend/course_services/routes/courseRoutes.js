import express from "express";
import { authMiddleware } from "../../auth/middlewares/authMiddl.js";
import { roleMiddleware } from "../../auth/middlewares/roleMiddl.js";
import { createCourse, getAllCourses, deleteCourse, addModule } from "../controllers/courseController.js";


const router=express.Router();

//public
router.get("/",getAllCourses);

//admin
router.post("/",authMiddleware,roleMiddleware("admin"),createCourse);
router.post("/:courseId/modules",authMiddleware,roleMiddleware("admin"),addModule);
router.delete("/:courseId",authMiddleware,roleMiddleware("admin"),deleteCourse);

export default router;