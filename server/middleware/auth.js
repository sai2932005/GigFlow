const jwt = require('jsonwebtoken') ;

const auth =async (req,res,next)=>{

    const authHeader = req.headers.authorization 

    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message :"token isnt provided"});

    }

    const token = authHeader.split(" ")[1];
    try{

    
        const decode = await jwt.verify(token,process.env.JWT_SECRET) ;
        req.user = decode ;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid or Expired token "})
    }




}


module.exports = auth;