const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    bio:{
        type:String,
        trim:true
    },
    displayName:{
        type:String,
        trim:true
    },
    socialLinks:{
        instagram:String,
        twitter:String,
        github:String,
        website:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);