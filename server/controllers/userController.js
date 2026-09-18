const User = require("../models/User");
const Application = require("../models/Application");
const Job = require("../models/Job") ;

const updateUserProfile = async(req,res)=>{

    try{
        const {skills,name,bio,portfolioUrl} = req.body ;

        const updates = {};
        if(skills!== undefined) updates.skills = skills ;
        if(name !== undefined) updates.name = name ;
        if(bio !== undefined) updates.bio = bio;
        if(portfolioUrl !== undefined) updates.portfolioUrl = portfolioUrl;
        
        const user = await User.findByIdAndUpdate(req.user.id,updates,{
             returnDocument: "after" ,
            runValidators : true
        }).select('-password');

        res.status(200).json(user);

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server error ", error : err.message})
    }
}


const getStats = async(req,res)=>{
    try{
        if(req.user.role === 'freelancer'){
            const total = await Application.countDocuments({applicant:req.user.id});
            const pending = await Application.countDocuments({applicant:req.user.id , status:"pending"});
            const accepted = await Application.countDocuments({ applicant: req.user.id, status: "accepted" });
            const rejected = await Application.countDocuments({ applicant: req.user.id, status: "rejected" });
            return res.status(200).json({ total, pending, accepted, rejected });
        }

        if(req.user.role==="client"){
            const total = await Job.countDocuments({ client: req.user.id });
            const open = await Job.countDocuments({ client: req.user.id, status: "open" });
            const assigned = await Job.countDocuments({ client: req.user.id, status: "assigned" });
            const completed = await Job.countDocuments({ client: req.user.id, status: "completed" });
            return res.status(200).json({ total, open, assigned, completed });
        }

    }catch(err){
        res.status(500).json({message:"Server Error",err})
    }
}





module.exports = {updateUserProfile,getStats};