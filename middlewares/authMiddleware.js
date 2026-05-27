const jwt = require("jsonwebtoken");
const User = require("../models/User");

// get token from header
const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return null;
};

const verifyToken = async(req,res,next)=>{
    try{
        const token = getToken(req);
        if(!token){
            return res.status(401).json({success:false, message:"No token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({success:false, message:"User not found"});
        }
        req.user = user;
        next();
    }catch(error){
        res.status(500).json({success:false, error:error.message});
    }
};

// rfresh token
// const refreshToken = async(req,res,next)=>{
//     try{
//         const token = getToken(req);
//         if(!token){
//             return res.status(401).json({success:false, message:"No token provided"});
//         }
//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         if(!user){
//             return res.status(401).json({success:false, message:"User not found"});
//         }
//         req.user = user;
//         next();
//     }catch(error){
//         res.status(500).json({success:false, error:error.message});
//     }
// };

module.exports = { getToken, verifyToken}
