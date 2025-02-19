import { connectDB } from '../../../lib/db';
import User from '../../../lib/models/User';
import authMiddleware from '../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const user = await authMiddleware(req, res);
    if (!user) return;

    const userData = await User.findById(user._id).select('-password'); // Hindari mengirim password
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
}
