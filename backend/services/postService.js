import mongoose from "mongoose";
import Tag from "../models/Tags.js";
import Post from "../models/Post.js";

class PostService {
    // Helper to find or create tags by name, returning their ObjectIds
    async resolveTags(tags) {
        if (!tags || !Array.isArray(tags)) return [];
        const resolvedTagIds = [];
        
        for (let t of tags) {
            t = t.trim();
            if (!t) continue;
            
            // Check if this is a valid ObjectId (an existing Tag reference)
            if (mongoose.Types.ObjectId.isValid(t)) {
                resolvedTagIds.push(t);
            } else {
                // Otherwise, treat as a tag name, find or create the Tag document
                let existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${t}$`, "i") } });
                if (!existingTag) {
                    existingTag = await Tag.create({ name: t, description: `Tag for ${t}` });
                }
                resolvedTagIds.push(existingTag._id);
            }
        }
        return resolvedTagIds;
    }

    // create post
    async createPost(postData) {
        if (postData.tags) {
            postData.tags = await this.resolveTags(postData.tags);
        }
        const post = new Post(postData);
        await post.save();
        return post;
    }

async getPosts(queryParams) {
  // Pagination
  const page =parseInt(queryParams.page) || 1;
  const limit =parseInt(queryParams.limit) || 10;
  const skip = (page - 1) * limit;

  // Search
  const search = queryParams.search || "";

  // Filters
  const category = queryParams.category;
  const author = queryParams.author;

  // Sorting
  const sort = queryParams.sort || "-createdAt";

  // Build query
  let query = { status: "published" };

  // Search
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Author filter
  if (author) {
    query.author = author;
  }

  // Fetch posts with references populated & lean JS object execution
  const posts = await Post.find(query)
    .populate("author", "name email avatar displayName")
    .populate("category", "name")
    .populate("tags", "name")
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean();

  // Count total posts
  const total = await Post.countDocuments(query);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    posts,
  };
};


    // get post by id
    async getPostById(postId) {
        const post = await Post.findById(postId);
        return post;
    }

    // update post
    async updatePost(postId, postData) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        post.title = postData.title || post.title;
        post.content = postData.content || post.content;
        post.category = postData.category || post.category;
        if (postData.tags) {
            post.tags = await this.resolveTags(postData.tags);
        }
        await post.save();
        return post;
    }

    // delete post
    async deletePost(postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        await post.deleteOne();
        return post;
    }

    // post saved draft
    async postSavedDraft(postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        post.status = "draft";
        await post.save();
        return post;
    }

// create draft
    async createDraft(postData) {
        const post = new Post(postData);
        await post.save();
        return post;
    }
    // schedule post
    async schedulePost(postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        post.status = "scheduled";
        await post.save();
        return post;
    }
    
}

export default new PostService();