import { connectDB } from '../../../lib/db';
import Comment from '../../../lib/models/Comment';
import Thread from '../../../lib/models/Thread';
import authMiddleware from '../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();

  const { threadId } = req.query;

  if (req.method === 'POST') {
    const user = await authMiddleware(req, res);
    if (!user) return;

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content is required' });

    try {
      const comment = await Comment.create({
        content,
        user: user._id,
        thread: threadId,
      });

      await Thread.findByIdAndUpdate(threadId, { $push: { comments: comment._id } });

      res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  } else if (req.method === 'GET') {
    try {
      const comments = await Comment.find({ thread: threadId }).populate('user', 'username');
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
