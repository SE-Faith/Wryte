import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    createdAt:{

        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model("Comment", commentSchema);
