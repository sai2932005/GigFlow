const Application = require("../models/Application");
const Job = require("../models/Job");



const applyToJob = async(req,res)=>{
    try{

    
        const {message} = req.body ;
        const jobId = req.params.jobId ;

        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({message:"job not found"})
        }

        if(job.status!= "open"){
            return res.status(404).json({message:"this job is no longer accepting applications "})

        }
        const existing = await Application.findOne({job:jobId , applicant: req.user.id}) 
        if(existing){
            return res.status(400).json({message:"You have already applied to this job"})
        }

        const newApplication = await Application.create({
            job:jobId ,
            applicant: req.user.id,
            message 
        })
        res.status(201).json(newApplication);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Client error",error: 
            err.message})
    }

}

const getMyApplications = async(req,res)=>{
    try{
        const applications = await Application.find({applicant:req.user.id}).populate("job" ,"title status budget");

        res.status(200).json(applications);

    }catch(err){
        res.status(500).json({message:"Server error",err})
    }
}

const getApplicationsForJob = async(req,res)=>{
    try{
        const jobId = req.params.jobId 

        const job = await Job.findById(jobId);
        if(!job){
            return res.status(401).json({message:"the job is currently not available"});
        }

        if(job.client.toString() !== req.user.id){
            return res.status(400).json({message:"This job doesnt belong to you"});

        }

        const apps = await Application.find({job:jobId}).populate("applicant","name email portfolioUrl skills bio");
        res.status(201).json(apps);

    }
    catch(err){
        res.status(500).json({message:"Server Error ",error:err.message});

    }
}



const acceptApplication = async(req,res)=>{
    try{
        const application =  await Application.findById(req.params.id);

        if(!application){
            return res.status(404).json({message:"The application not found"});
        }
        const job = await Job.findById(application.job);

        if(job.client.toString() !== req.user.id){
            return res.status(403).json({message:"You dont own this job to accept application"});

        }

        if(job.status !== "open"){
            return res.status(404).json({message:`this job is ${job.status}`});
        }

        job.status = "assigned";
        job.assignedTo= application.applicant ;
        await job.save() ;

        application.status = "accepted";
        await application.save() ;

        await Application.updateMany(
            {job : job._id, _id: { $ne :application._id }},
            {status : "rejected"}

        )

        res.status(201).json({message:"application accepted , job assigned ",job,application});






    }
    catch(err){
        res.status(500).json({message:"Server error", error :err.message})

    }
}


module.exports = {acceptApplication,getApplicationsForJob,applyToJob,getMyApplications} ;