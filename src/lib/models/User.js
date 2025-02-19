import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Followers list
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Following list
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
