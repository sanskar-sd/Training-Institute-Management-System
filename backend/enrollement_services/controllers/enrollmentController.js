import Enrollment from "../models/enrollment.js";

//single student enroll
export const enrollStudent=async (req,res)=>{

    try{
        const {studentId, courseId}=req.body;
    
        const existing = await Enrollment.findOne({studentId, courseId});
        if(existing){
            return  res.status(400).json({message:"Student already enrolled in this course"});
        }

        const enrollment=new Enrollment({studentId, courseId});
        await enrollment.save();


        res.status(201).json({message:"Student enrolled successfully", enrollment});
    }catch(err){
        console.error("Enrollment Error:", err);
        res.status(500).json({message:"Server error", error:err.message});
    }
};



//bulk enroll students
export const bulkEnrollStudents = async (req, res) => {
  try {
    const { studentIds, courseId } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: "studentIds must be an array" });
    }

    const enrollments = studentIds.map(id => ({
      studentId: id,
      courseId,
    }));

    await Enrollment.insertMany(enrollments);

    res.status(201).json({ message: "Students enrolled successfully" });
  } catch (err) {
    console.error("Bulk Enrollment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



//get all courses a student is enrolled in
export const getStudentCourses=async (req,res)=>{
    try{
        const {studentId}=req.params;
        const enrollments=await Enrollment.find({studentId})
        res.status(200).json(enrollments);
    }catch(err){
        console.error("Get Student Courses Error:", err);
        res.status(500).json({message:"Server error", error:err.message});
    }

};


// get all enrollments (admin)
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({});
    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Get All Enrollments Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};