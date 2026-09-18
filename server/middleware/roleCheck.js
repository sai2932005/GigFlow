const requireRole =(role) => (req,res,next)=>{
    if(req.user.role !== role){
        return res.status(401).json({message:`Only ${role}s can access this page`});
        }
    next();
}

module.exports = requireRole ;