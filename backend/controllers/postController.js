import postService from "../services/postService.js";

export const createPost = async (req, res) => {
    try {
        // Strip any client-supplied author or user ID fields to prevent impersonation
        const { author, user, userId, ...postData } = req.body;
        
        // Assign author from authenticated user injected by verifyToken
        postData.author = req.user.id;

        const post = await postService.createPost(postData);
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.log("Error in postController.createPost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts(req.query);
        res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.log("Error in postController.getPosts:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        res.status(200).json({ message: "Post retrieved successfully", post });
    } catch (error) {
        console.log("Error in postController.getPostById:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Verify ownership (only original author or admin can update)
        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }
        
        // Strip user-related/author fields to prevent impersonation on updates
        const { author, user, userId, ...updateData } = req.body;

        const updatedPost = await postService.updatePost(postId, updateData);
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.log("Error in postController.updatePost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Verify ownership (only original author or admin can delete)
        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        const deletedPost = await postService.deletePost(postId);
        res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
    } catch (error) {
        console.log("Error in postController.deletePost:", error);
        res.status(400).json({ message: error.message });
    }
};