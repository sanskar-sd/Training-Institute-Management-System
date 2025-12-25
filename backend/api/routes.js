import express from 'express';
import axios from 'axios';
import { SERVICE_URLS } from './serviceUrl.js';
import { verifyToken } from './authmiddleware.js';


const router=express.Router();
//Auth Routes
router.post("/auth/register",async(req,res)=>{
    try{
        const responnse=await axios.post(`${SERVICE_URLS.auth}/register`,req.body);
        res.status(200).json(responnse.data);
    }
    catch(err){
        res.status(500).json({message:'Error registering user',error:err.message});
    }
});

router.post("/auth/login",async(req,res)=>{
    try{
        const response=await axios.post(`${SERVICE_URLS.auth}/login`,req.body);
        res.status(200).json(response.data);
    }catch(err){
        res.status(500).json({message:'Error logging in',error:err.message});
    }
});


//Protected Routes Example
router.get("/courses",verifyToken,async(req,res)=>{
    try{
        const response=await axios.get(`${SERVICE_URLS.course}/courses`);
        res.status(response.status).json(response.data);
    }catch(err){
        res.statuus(500).json({message:'Error fetching courses',error:err.message});
    }
});


export default router;