// backend/middleware/uploadToCloudinary.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false);
    cb(null, true);
  }
});

export default function uploadToCloudinary(fieldName = 'photo') {
  return (req, res, next) => {
    const single = upload.single(fieldName);
    single(req, res, async (err) => {
      if (err) return next(err);
      // no file
      if (!req.file || !req.file.buffer) return next();
      try {
        const mime = req.file.mimetype || 'image/jpeg';
        const b64 = req.file.buffer.toString('base64');
        const dataUri = `data:${mime};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: process.env.CLOUDINARY_FOLDER || 'farmers_profiles',
          resource_type: 'image'
        });
        req.body.photo = result.secure_url || result.url;
        req.body.photo_public_id = result.public_id;
        next();
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr);
        next(uploadErr);
      }
    });
  };
}
