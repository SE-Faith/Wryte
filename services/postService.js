const Post = require("../models/Post");

class PostService {
    // create post
    async createPost(postData) {
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
  let query = { status: "PUBLISHED" };

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

  // Fetch posts
  const posts = await Post.find(query)
    .skip(skip)
    .limit(limit)
    .sort(sort);

  // Count total posts
  const total =
    await Post.countDocuments(query);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(
      total / limit
    ),
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
        post.tags = postData.tags || post.tags;
        await post.save();
        return post;
    }

    // delete post
    async deletePost(postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        await post.remove();
        return post;
    }

    // post saved draft
    async postSavedDraft(postId) {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        post.status = "saved";
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

module.exports = new PostService();