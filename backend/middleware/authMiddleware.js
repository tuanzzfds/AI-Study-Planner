// filepath: /c:/Users/ADMIN/Documents/Downloads/code/mystdudyclone/backend/middleware/authMiddleware.js
const admin = require('../utils/firebase');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader); // Debugging log

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    console.log('Received ID Token:', idToken); // Debugging log

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Decoded Token:', decodedToken); // Debugging log
      req.user = { uid: decodedToken.uid, email: decodedToken.email };

      // Find or create the user in the database
      let user = await User.findOne({ uid: decodedToken.uid });
      if (!user) {
        user = new User({
          uid: decodedToken.uid,
          fullName: decodedToken.name || 'Anonymous',
          email: decodedToken.email,
          username: decodedToken.email.split('@')[0], // Set username based on email if not provided
        });
        await user.save();
        console.log('Created new user:', user); // Debugging log
      }
      req.user.id = user._id; // Attach the MongoDB user ID
      next();
    } catch (error) {
      console.error('Authentication Error:', error); // Error log
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } else {
    console.warn('No Authorization header provided'); // Warning log
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = authMiddleware;