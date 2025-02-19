import jwt from 'jsonwebtoken';
import User from '../lib/models/User';
import { connectDB } from '../lib/db';

export default async function authMiddleware(req, res) {
  await connectDB(); // Pastikan koneksi ke database aktif

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    return user;
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
