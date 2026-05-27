const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


class AuthServices{
    async register(data){
        const {name,email,password,role} = data;
        const existingUser = await User.findOne({email});

        if(existingUser){
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            {name,
            email,
            password:hashedPassword,
            role});

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );
        return {user,token};
    }

    async login(data){
        const {email, password} = data;
        const user = await User.findOne({email});

        if(!user){
            throw new Error("Invalid Email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            throw new Error("Invalid Email or password");
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );
        return {user,token};
    }

    async changePassword(userId, currentPassword,newPassword){
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
       
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid current password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();  

        
        return user;
    }
}

module.exports = new AuthServices();    