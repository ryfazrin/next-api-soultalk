import { connectDB } from '../../../lib/db';
import Thread from '../../../lib/models/Thread';
import authMiddleware from '../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const thread = await Thread.findById(id).populate('user', 'username');
      if (!thread) return res.status(404).json({ message: 'Thread not found' });

      res.status(200).json(thread);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching thread', error });
    }
  } 
  else if (req.method === 'PUT') {
    const user = await authMiddleware(req, res);
    if (!user) return;

    try {
      const thread = await Thread.findById(id);
      if (!thread) return res.status(404).json({ message: 'Thread not found' });

      if (thread.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this thread' });
      }

      const { content, tags } = req.body;
      thread.content = content || thread.content;
      thread.tags = tags || thread.tags;
      await thread.save();

      res.status(200).json({ message: 'Thread updated', thread });
    } catch (error) {
      res.status(500).json({ message: 'Error updating thread', error });
    }
  } 
  else if (req.method === 'DELETE') {
    const user = await authMiddleware(req, res);
    if (!user) return;

    try {
      const thread = await Thread.findById(id);
      if (!thread) return res.status(404).json({ message: 'Thread not found' });

      if (thread.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this thread' });
      }

      await Thread.findByIdAndDelete(id);
      res.status(200).json({ message: 'Thread deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting thread', error });
    }
  } 
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
