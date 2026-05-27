import authServices from "../services/authService.js";

export const register = async(req,res) =>{
    try{
        const user = await authServices.register(req.body);
        res.status(201).json({success:true, user});
    }catch(error){
        console.log("Error in authController.register:", error);
        res.status(500).json({success:false, error:error.message});
    }
};

export const login = async(req,res) =>{
    try{
        const result = await authServices.login(req.body);
        res.status(200).json({success:true, result});
    }catch(error){
        console.log("Error in authController.login:", error);
        res.status(500).json({success:false, error:error.message});
    }
};  

export const changePassword = async(req,res) =>{
    try{
        const {userId, currentPassword, newPassword} = req.body;
        const result = await authServices.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({success:true, result});
    }catch(error){
        console.log("Error in authController.changePassword:", error);
        res.status(500).json({success:false, error:error.message});
    }
};  

