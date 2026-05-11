// backend/routes/profileRoute.js
import express from 'express';
import * as ctrl from '../controllers/profileController.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';

const router = express.Router();

// Create profile: uses middleware to upload the 'photo' file (optional)
router.post('/', uploadToCloudinary('photo'), ctrl.createProfile);

// List + search
router.get('/', ctrl.getProfiles);

// Get single profile
router.get('/:id', ctrl.getProfileById);

// Update profile: also accept optional new photo file
router.put('/:id', uploadToCloudinary('photo'), ctrl.updateProfile);

// Delete profile
router.delete('/:id', ctrl.deleteProfile);

export default router;
