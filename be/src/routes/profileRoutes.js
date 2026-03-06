const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, uploadProfileImage } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');
const { logActivity } = require('../middleware/activityLogger');

router.use(protect);

router.get('/',    getProfile);
router.put('/',    logActivity('UPDATE', 'Profile', 'Updated profile'), updateProfile);
router.put('/password', logActivity('UPDATE', 'Profile', 'Changed password'), changePassword);
router.put('/image', uploadProfile.single('image'), logActivity('UPDATE', 'Profile', 'Updated profile image'), uploadProfileImage);

module.exports = router;
