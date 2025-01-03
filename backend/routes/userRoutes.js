const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
// Sign Up
router.post('/signup', userController.signup);
// Get User Profile route
router.get('/profile', authMiddleware, userController.getUserProfile);
// Log In
router.post('/login', userController.login);

// Log Out
router.post('/logout', userController.logout);
// Set up multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage });
  
  // Update User Profile route
  router.put(
    '/profile',
    authMiddleware,
    upload.single('profilePicture'),
    userController.updateUserProfile
  );
  // Change User Password Endpoint
  router.put(
    '/change-password',
    authMiddleware,
    userController.changeUserPassword
  );

module.exports = router;