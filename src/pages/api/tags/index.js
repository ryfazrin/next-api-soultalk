import { connectDB } from '../../../lib/db';
import Thread from '../../../lib/models/Thread';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const threads = await Thread.find({}, 'tags');
    const tagsSet = new Set();

    threads.forEach(thread => {
      thread.tags.forEach(tag => tagsSet.add(tag));
    });

    const tagsArray = Array.from(tagsSet);
    res.status(200).json(tagsArray);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
}
