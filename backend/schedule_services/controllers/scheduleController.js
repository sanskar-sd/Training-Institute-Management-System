import { Schedule } from "../models/schedule.js";
import mongoose from "mongoose";

//create schedule
export const createSchedule=async(req,res)=>{
    try{
        const {courseId,topic,instructor,startTime,endTime,meetingLink}=req.body;

        if(!courseId || !topic || !instructor || !startTime || !endTime || !meetingLink){
            return res.status(400).json({message:"All fields are required"});
        }

        const schedule=new Schedule({
            courseId:new mongoose.Types.ObjectId(courseId),topic,instructor,startTime,endTime,meetingLink
        });

        await schedule.save();
        res.status(201).json({message:"Schedule created successfully",schedule});
    }catch(err){
        console.error("Create Schedule Error:", err);
        res.status(500).json({message:"Server error", error:err.message});
    }
};



//get all schedules 
export const getAllSchedules=async(req,res)=>{
    try{
        const schedules=await Schedule.find();
        res.status(200).json(schedules);
    }catch(err){
        console.error("Get All Schedules Error:", err);
        res.status(500).json({message:"Server error", error:err.message});
    }
};



//get schedule by course
export const getScheduleByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const schedules = await Schedule.find({
      courseId: new mongoose.Types.ObjectId(courseId),
    });
    res.status(200).json(schedules);
  } catch (err) {
    console.error("Get Schedule By Course Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
