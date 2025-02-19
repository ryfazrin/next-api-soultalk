import { connectDB } from '../../../lib/db';
import User from '../../../lib/models/User';
import authMiddleware from '../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = await authMiddleware(req, res);
  if (!user) return;

  const { bio, profilePicture } = req.body;

  try {
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
}
