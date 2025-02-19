import { connectDB } from '../../../../lib/db';
import Thread from '../../../../lib/models/Thread';
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

    const thread = await Thread.findById(id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    // Check if user already liked the thread
    const userLikedIndex = thread.likes.findIndex((userId) => userId.toString() === user._id.toString());

    if (userLikedIndex === -1) {
      // User has not liked -> Add like
      thread.likes.push(user._id);
    } else {
      // User has liked -> Remove like
      thread.likes.splice(userLikedIndex, 1);
    }

    await thread.save();
    res.status(200).json({ message: 'Like updated', likes: thread.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like', error });
  }
}
