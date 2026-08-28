// config/cron.js
import cron from 'node-cron';
import Post from '../models/Post.js';

// Schedule to run every day for testing
cron.schedule('0 0 * * *', async () => {
  try {
    // Find posts that are scheduled for tomorrow or earlier
    const postsToPublish = await Post.find({
      status: 'scheduled',
      scheduledAt: { $lte: new Date() }
    });

    // Update their status to 'published'
    for (const post of postsToPublish) {
      post.status = 'published';
      await post.save();
    }

    console.log(`Published ${postsToPublish.length} scheduled posts`);
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
  }
});

console.log('Cron job scheduled to run every day at midnight');