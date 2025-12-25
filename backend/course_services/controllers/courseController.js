import Course from "../models/course.js";
import Module from "../models/module.js";

export const createCourse=async (req,res)=>{
    try{
        const {title,description}=req.body;
        const newCourse=new Course({title,description, modules:[]});
        await newCourse.save();

        res.status(201).json({message:"Course created successfully", course:newCourse});
    }catch(err){
        console.error("Create Course Error:", err);
        res.status(500).json({message:"Server error", error:err.message});
    }
};


export const addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newModule = new Module({ title, content, duration });
    await newModule.save();

    course.modules.push(newModule._id);
    await course.save();

    res.json({ message: "Module added successfully", course });
  } catch (err) {
    console.error("Error adding module:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
};
