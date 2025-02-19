import { connectDB } from '../../../lib/db';
import Thread from '../../../lib/models/Thread';
import authMiddleware from '../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = await authMiddleware(req, res);
  if (!user) return;

  const { threadId } = req.query;

  try {
    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const hasLiked = thread.likes.includes(user._id);

    if (hasLiked) {
      thread.likes = thread.likes.filter(id => id.toString() !== user._id.toString());
    } else {
      thread.likes.push(user._id);
    }

    await thread.save();
    res.status(200).json({ message: hasLiked ? 'Unliked' : 'Liked', thread });
  } catch (error) {
    res.status(500).json({ message: 'Error processing like/unlike', error });
  }
}
