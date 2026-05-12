// backend/controllers/profileController.js

import mongoose from 'mongoose';
import Profile from '../models/profileModel.js';

const badReq = (res, msg = 'Bad Request') =>
  res.status(400).json({
    success: false,
    message: msg
  });

/**
 * POST /api/farmers
 */
export async function createProfile(req, res) {

  try {

    const {
      name,
      phone,
      location,
      size,
      crops,
      bio,
      past
    } = req.body;

    if (!name || !phone || !location || !crops) {
      return badReq(
        res,
        'Missing required fields: name, phone, location, crops'
      );
    }

    let pastArr = [];

    if (past) {

      if (Array.isArray(past)) {
        pastArr = past;
      }

      else {

        try {
          pastArr = JSON.parse(past);
        }

        catch {
          pastArr = typeof past === 'string' ? [past] : [];
        }

      }

    }

    const profile = new Profile({

      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),

      size: size ? String(size).trim() : '',

      crops: String(crops).trim(),

      bio: bio ? String(bio).trim() : '',

      past: pastArr,

      photo:
        req.body.photo ||
        (req.body.photo === '' ? '' : req.body.photo),

      photo_public_id:
        req.body.photo_public_id || ''

    });

    const saved = await profile.save();

    return res.status(201).json({
      success: true,
      data: saved
    });

  }

  catch (err) {

    console.error('createProfile error:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }

}

/**
 * GET /api/farmers
 */
export async function getProfiles(req, res) {

  try {

    const {
      q = '',
      page = 1,
      limit = 25,
      crop
    } = req.query;

    const pageNum =
      Math.max(1, parseInt(page, 10) || 1);

    const lim =
      Math.max(1, Math.min(200, parseInt(limit, 10) || 25));

    const skip = (pageNum - 1) * lim;

    const filter = {};

    if (q) {

      const regex = new RegExp(q.trim(), 'i');

      filter.$or = [
        { name: regex },
        { crops: regex },
        { location: regex },
        { bio: regex }
      ];

    }

    if (crop) {
      filter.crops = new RegExp(String(crop).trim(), 'i');
    }

    const [total, items] = await Promise.all([

      Profile.countDocuments(filter),

      Profile.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(lim)
        .lean()

    ]);

    return res.json({

      success: true,

      meta: {
        total,
        page: pageNum,
        limit: lim,
        pages: Math.ceil(total / lim)
      },

      data: items

    });

  }

  catch (err) {

    console.error('getProfiles error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles'
    });

  }

}

/**
 * GET /api/farmers/:id
 */
export async function getProfileById(req, res) {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badReq(res, 'Invalid id');
    }

    const profile = await Profile.findById(id).lean();

    if (!profile) {

      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });

    }

    return res.json({
      success: true,
      data: profile
    });

  }

  catch (err) {

    console.error('getProfileById error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });

  }

}

/**
 * GET /api/farmers/phone/:phone
 */
export async function getProfileByPhone(req, res) {

  try {

    const { phone } = req.params;

    const profile = await Profile.findOne({ phone }).lean();

    if (!profile) {

      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });

    }

    return res.json({
      success: true,
      data: profile
    });

  }

  catch (err) {

    console.error('getProfileByPhone error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });

  }

}

/**
 * PUT /api/farmers/:id
 */
export async function updateProfile(req, res) {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badReq(res, 'Invalid id');
    }

    const allowed = [
      'name',
      'phone',
      'location',
      'size',
      'crops',
      'bio',
      'past',
      'photo',
      'photo_public_id'
    ];

    const updates = {};

    for (const k of allowed) {

      if (
        Object.prototype.hasOwnProperty.call(req.body, k)
      ) {
        updates[k] = req.body[k];
      }

    }

    updates.updatedAt = new Date();

    if (updates.past && !Array.isArray(updates.past)) {

      try {
        updates.past = JSON.parse(updates.past);
      }

      catch {}

    }

    const updated =
      await Profile.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
          runValidators: true
        }
      ).lean();

    if (!updated) {

      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });

    }

    return res.json({
      success: true,
      data: updated
    });

  }

  catch (err) {

    console.error('updateProfile error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });

  }

}

/**
 * DELETE /api/farmers/:id
 */
export async function deleteProfile(req, res) {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badReq(res, 'Invalid id');
    }

    const removed =
      await Profile.findByIdAndDelete(id).lean();

    if (!removed) {

      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });

    }

    return res.json({
      success: true,
      message: 'Profile deleted'
    });

  }

  catch (err) {

    console.error('deleteProfile error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile'
    });

  }

}