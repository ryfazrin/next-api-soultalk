import { connectDB } from '../../../../lib/db';
import User from '../../../../lib/models/User';
import Thread from '../../../../lib/models/Thread';
import authMiddleware from '../../../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await User.findById(id).select("-password").lean();
      if (!user) return res.status(404).json({ message: "User not found" });

      const threads = await Thread.find({ user: id }).lean();
      const authUser = await authMiddleware(req, res);
      
      res.status(200).json({
        ...user,
        threads,
        isFollowing: authUser ? user.followers.includes(authUser._id) : false,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
