import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referensi ke model User
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String, // Array kategori/tag untuk memudahkan pencarian
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User yang menyukai thread ini
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Komentar pada thread ini
  }],
}, { timestamps: true });

export default mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
