const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User") ;

const register =async (req,res)=>{
    try{

    
        const {name,email,password,role} = req.body ;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});

        }

        const hashedPass = await bcrypt.hash(password,10);

        const user1 = await User.create({name,email,password:hashedPass,role});
        const token = jwt.sign({
            id:user1._id,
            role:user1.role 
        } , 
        process.env.JWT_SECRET , {expiresIn:"7d"});

        res.status(201).json({token ,user:{id:user1._id, name:user1.name, role:user1.role}}) ;
    }
    catch(err){
        res.status(500).json({message:"server Error ",err});
    }




    


}


const login = async(req,res)=>{
    try{
        const {email,password} = req.body ;

        const user2 = await User.findOne({email});
        if(!user2){
            return res.status(400).json({message:"Invalid Credintials"}) ;
        }

        const passMatch =await bcrypt.compare(password,user2.password);
        console.log("enteredPassword",password)
        console.log(passMatch)

        

        if(!passMatch){
            return res.status(400).json({message:"Invalid credintials"});
        }

        const token1 = jwt.sign({id:user2._id , role : user2.role},process.env.JWT_SECRET,{expiresIn:"8d"});

        res.status(200).json({token:token1 ,user: {id: user2._id, name: user2.name,role: user2.role} });
    }catch(err){
        res.status(500).json({message:"Server error",error : err.message});
    }
    
    
    }


module.exports = {register,login};
