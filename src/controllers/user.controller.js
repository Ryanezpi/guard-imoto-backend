import admin from '../utils/config/firebase.js';
import User from '../models/user.model.js';
import { getStorage } from 'firebase-admin/storage';
import { extname } from 'path';
import fs from 'fs';

// PUT /api/user/profile
async function updateUserProfile(req, res) {
  const { first_name, last_name, phone_number } = req.body;
  const firebase_uid = req.user.uid; // from JWT
  let profile_picture_url = null;

  try {
    // ✅ Handle profile picture upload (if file provided)
    if (req.file) {
      const storage = getStorage();
      const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
      const fileName = `profile_pictures/${firebase_uid}_${Date.now()}${extname(req.file.originalname)}`;
      const fileUpload = bucket.file(fileName);

      // Upload to Firebase Storage
      await fileUpload.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });

      // Make file publicly accessible
      await fileUpload.makePublic();
      profile_picture_url = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
    }

    // ✅ Update Firebase Auth display name (optional)
    await admin.auth().updateUser(firebase_uid, {
      displayName: `${first_name || ''} ${last_name || ''}`.trim(),
      photoURL: profile_picture_url || undefined,
      phoneNumber: phone_number || undefined,
    });

    // ✅ Update SQLite user record
    User.updateProfile(
      firebase_uid,
      { first_name, last_name, phone_number, profile_picture: profile_picture_url },
      function (err) {
        if (err) {
          console.error('Database update error:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.status(200).json({
          message: 'Profile updated successfully',
          profile_picture: profile_picture_url,
        });
      }
    );
  } catch (err) {
    console.error('updateUserProfile error:', err);
    return res.status(500).json({ error: err.message });
  }
}

export default { updateUserProfile };
