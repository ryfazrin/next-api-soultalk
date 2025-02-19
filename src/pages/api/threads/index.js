import { connectDB } from '../../../lib/db';
import Thread from '../../../lib/models/Thread';
import authMiddleware from '../../../utils/authMiddleware';

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create a new thread
 *     tags: [Threads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Thread created successfully
 *       500:
 *         description: Server error
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectDB();

    const user = await authMiddleware(req, res);
    if (!user) return;

    const { title, content, tags } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
      const thread = await Thread.create({
        title,
        content,
        tags,
        user: user._id,
      });

      res.status(201).json({ message: 'Thread created', thread });
    } catch (error) {
      res.status(500).json({ message: 'Error creating thread', error });
    }
  } else if (req.method === 'GET') {
    await connectDB();

    try {
      const threads = await Thread.find().populate('user', 'username').sort({ createdAt: -1 });
      res.status(200).json(threads);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching threads', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
