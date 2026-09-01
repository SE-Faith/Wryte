import mongoose from "mongoose";
import Category from "./Category.js";
import Tag from "./Tags.js";
import Comment from "./Comment.js";

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:false
    },
    tags:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Tag",
        default:[]
    },
    status:{
        type:String,
        enum:["draft","published","archived","scheduled"],
        default:"draft"
    },
    scheduledAt:{
        type:Date,
        default:null
    },
    publishedAt:{
        type:Date,
        default:null
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Comment",
        default:[]
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

// Create database indexes for fast query performance
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1, createdAt: -1 });
postSchema.index({ author: 1, status: 1, createdAt: -1 });

// Compound Full-Text search index with weighted fields
postSchema.index(
    { title: "text", content: "text" },
    { weights: { title: 10, content: 1 }, name: "PostFullTextIndex" }
);

export default mongoose.model("Post", postSchema);
