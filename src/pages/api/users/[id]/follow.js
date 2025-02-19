import { connectDB } from '../../../../lib/db';
import User from '../../../../lib/models/User';
import authMiddleware from '../../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = await authMiddleware(req, res);
  if (!user) return;

  const { id } = req.query;

  if (id === user._id.toString()) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  try {
    const followedUser = await User.findById(id);
    if (!followedUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = user.following.includes(id);

    if (isFollowing) {
      user.following = user.following.filter(oldId => id.toString() !== oldId.toString());
      followedUser.followers = followedUser.followers.filter(id => id.toString() !== user._id.toString());
    } else {
      user.following.push(id);
      followedUser.followers.push(user._id);
    }

    await user.save();
    await followedUser.save();

    res.status(200).json({ message: isFollowing ? 'Unfollowed' : 'Followed', user });
  } catch (error) {
    res.status(500).json({ message: 'Error following/unfollowing user', error });
  }
}
