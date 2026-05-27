const mongoose = require("mongoose");
const Category = require("./Category");
const Tag = require("./Tags");
const Comment = require("./Comment");

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
        required:true
    },
    tags:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Tag",
        default:[]
    },
    status:{
        type:String,
        enum:["draft","published","archived"],
        default:"draft"
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

module.exports = mongoose.model("Post", postSchema);
