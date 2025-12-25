import mongoose from "mongoose";

const enrollmentSchema=new mongoose.Schema({
    studentId: {type:mongoose.Schema.Types.ObjectId, required:true},
    courseId: {type:mongoose.Schema.Types.ObjectId, required:true},
    enrollmentDate: {type:Date, default:Date.now}
});

export default mongoose.model("Enrollment", enrollmentSchema);