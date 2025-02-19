import { connectDB } from '../../../../lib/db';
import Comment from '../../../../lib/models/Comment';
import authMiddleware from '../../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const user = await authMiddleware(req, res);
    if (!user) return;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user already liked the comment
    const userLikedIndex = comment.likes.findIndex((userId) => userId.toString() === user._id.toString());

    if (userLikedIndex === -1) {
      // User has not liked -> Add like
      comment.likes.push(user._id);
    } else {
      // User has liked -> Remove like
      comment.likes.splice(userLikedIndex, 1);
    }

    await comment.save();
    res.status(200).json({ message: 'Like updated', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like', error });
  }
}
