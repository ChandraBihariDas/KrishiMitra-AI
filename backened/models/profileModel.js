import mongoose from 'mongoose';

const PastSchema = new mongoose.Schema({
  name: String,
  year: String,
  yield: String
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  size: String,
  crops: String,
  bio: String,
  past: [PastSchema],
  photo: String,           // Cloudinary secure URL
  photo_public_id: String, // Cloudinary public_id (for deletion)
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
