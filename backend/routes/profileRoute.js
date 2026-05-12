// backend/routes/profileRoute.js

import express from 'express';
import * as ctrl from '../controllers/profileController.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';

const router = express.Router();

router.post('/', uploadToCloudinary('photo'), ctrl.createProfile);

router.get('/', ctrl.getProfiles);

router.get('/phone/:phone', ctrl.getProfileByPhone);

router.get('/:id', ctrl.getProfileById);

router.put('/:id', uploadToCloudinary('photo'), ctrl.updateProfile);

router.delete('/:id', ctrl.deleteProfile);

export default router;