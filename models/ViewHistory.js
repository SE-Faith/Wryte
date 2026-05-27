import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false // viewedAt is sufficient
    }
);

// Create compound unique index to unique-resolve history records per user/post
viewHistorySchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model("ViewHistory", viewHistorySchema);
