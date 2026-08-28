import bookmarkService from "../services/bookmarkService.js";

export const bookmarkPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const bookmark = await bookmarkService.bookmarkPost(req.user._id, postId);
        res.status(200).json({ message: "Post bookmarked successfully", bookmark });
    } catch (error) {
        console.log("Error in bookmarkController.bookmarkPost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const unbookmarkPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const bookmark = await bookmarkService.unbookmarkPost(req.user._id, postId);
        res.status(200).json({ message: "Post unbookmarked successfully", bookmark });
    } catch (error) {
        console.log("Error in bookmarkController.unbookmarkPost:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getBookmarksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookmarks = await bookmarkService.getBookmarksByUser(userId);
        res.status(200).json({ message: "Bookmarks retrieved successfully", bookmarks });
    } catch (error) {
        console.log("Error in bookmarkController.getBookmarksByUser:", error);
        res.status(400).json({ message: error.message });
    }
};