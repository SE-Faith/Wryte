import mongoose from "mongoose";

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
        select:false
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
        default:false
    },
    isSuspended:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
},
{
    timestamps:true
});

// Compound Full-Text search index on public profile fields (email excluded for privacy)
userSchema.index(
    { name: "text", displayName: "text", bio: "text" },
    { weights: { name: 10, displayName: 8, bio: 2 }, name: "UserFullTextIndex" }
);

export default mongoose.model("User", userSchema);