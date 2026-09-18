
const Job = require("../models/Job");

const createJob = async(req,res)=>{

    try{
        const {title,description,budget} = req.body ;

        const job = await Job.create({title,description,budget,client:req.user.id});
        return res.status(201).json({job});


    }catch(err){
        console.log(err);
        return res.status(500).json({message:"server Error",error:err.message});
    }
}


const getAllJobs = async(req,res)=>{
    try{
        const jobs = await Job.find({status:"open"}).populate("client", "name email");
        return res.status(200).json({jobs});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error ",error:err.message});
    }

}

const getjobById = async(req,res)=>{
    try{
        const job= await Job.findById(req.params.id).populate("client", "name email").populate("assignedTo", "name email");
        if(!job){
            return res.status(404).json({message:"Job not found"})
        }
        res.status(200).json(job);
    }
    catch(err){
        res.status(500).json({message:"server error",error:err.message})
    }
}

const assignJob = async(req,res)=>{
    try{
        const {freelancerId} = req.body ;
        const job = await Job.findById(req.params.id);

        if(!job){
            return res.status(404).json({message:"Job not found"});
        }

        if(job.client.toString() !== req.user.id){
            return res.status(403).json({message:"You do not own this job"});
        }
        if(job.status !== "open"){
            return res.status(400).json({message:`You cant assign this job ,this job is already ${job.status} `})
        }

        job.status = "assigned";
        job.assignedTo = freelancerId ;
        await job.save();
        res.status(200).json(job);
    }
    catch(err){
        res.status(500).json({message:"Server error",error : err.message});

    }
}


const completeJob = async(req,res)=>{
    try{
        const job = await Job.findById(req.params.id);

        if(!job){
            return res.status(404).json({message:"Job not found"});
        }

        if(job.client.toString() !== req.user.id){
            return res.status(403).json({message:"You do not own this job"});
        }
        if(job.status !== "assigned"){
            return res.status(400).json({message:`You cant assign the Job , this job is ${job.status}`});
        }

        job.status = "completed";
        await job.save();
        return res.status(200).json(job);
    }
    catch(err){
        res.status(500).json({message:"Server Error",error: err.message})
    }
}

const myJobs  = async(req,res)=>{
    try{
        const jobs = await Job.find({client :req.user.id}).populate("assignedTo" , "name email").sort({createdAt :-1}) ;
        res.status(200).json(jobs);


    }catch(err){
        res.status(500).json({message:"Server error",err}) ;
    }
}

module.exports = {createJob,getAllJobs,getjobById,assignJob,completeJob, myJobs};