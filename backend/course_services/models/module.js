import mongoose from "mongoose";

const moduleSchema=new mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String},
    duration:{type:Number} // duration in minutes
});

export default mongoose.model("Module", moduleSchema);