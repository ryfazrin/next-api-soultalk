import { connectDB } from '../../../lib/db';
import Thread from '../../../lib/models/Thread';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tag } = req.query;

  try {
    const threads = await Thread.find({ tags: tag }).populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching threads by tag', error });
  }
}
