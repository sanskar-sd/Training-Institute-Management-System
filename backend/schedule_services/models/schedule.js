import mongoose from "mongoose";

const scheduleSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    date:{
        type:Date,
        //required:true,
        default:Date.now()
    },
    topic:{
        type:String,
        //:true
    },
    instructor:{
        type:String,
        //required:true
    },
    startTime:{
        type:String,
        //required:true
    },
    endTime:{
        type:String,
        //required:true
    },
    meetingLink:{
        type:String,
        default:""
    }
},{timestamps:true});

export const Schedule=mongoose.model("Schedule",scheduleSchema);