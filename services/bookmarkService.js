import Bookmark from "../models/BookMark.js";

class BookmarkService {
    async bookmarkPost(userId, postId) {
        const bookmark = await Bookmark.create({ user: userId, post: postId });
        return bookmark;
    }

    async unbookmarkPost(userId, postId) {
        const bookmark = await Bookmark.findOneAndDelete({ user: userId, post: postId });
        return bookmark;
    }

    async getBookmarksByUser(userId) {
        const bookmarks = await Bookmark.find({ user: userId }).populate("post");
        return bookmarks;
    }
}

export default new BookmarkService();
