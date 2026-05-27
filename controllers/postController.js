const postService = require("../services/postService");

const createPost = async (req, res) => {
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.log("Error in postController.createPost:", error);
        res.status(400).json({ message: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts(req.query);
        res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.log("Error in postController.getPosts:", error);
        res.status(400).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        res.status(200).json({ message: "Post retrieved successfully", post });
    } catch (error) {
        console.log("Error in postController.getPostById:", error);
        res.status(400).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.updatePost(postId, req.body);
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.log("Error in postController.updatePost:", error);
        res.status(400).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.deletePost(postId);
        res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
        console.log("Error in postController.deletePost:", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};