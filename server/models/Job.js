const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:{type:String , required:true},
    description:{type:String, required:true},
    budget :{type:Number , required:true},
    client : {type: mongoose.Schema.Types.ObjectId , ref:"User",required:true},
    status :{type:String , enum :["open","assigned","completed"],default:"open"},
    assignedTo :{type:mongoose.Schema.Types.ObjectId , ref:"User" ,default:null}

},{timestamps : true}) ;


module.exports = mongoose.model("Job",jobSchema);