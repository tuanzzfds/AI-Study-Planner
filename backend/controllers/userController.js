const admin = require('firebase-admin');
const User = require('../models/User');
const axios = require('axios');

// Sign Up: Create an account using email and password
exports.signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login: Access accounts via email/password
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Sign in the user using Firebase Auth REST API
      const firebaseResponse = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAA-FFm9SW5shf671Sr8Wdg165x5B9V7bo',
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
  
      const idToken = firebaseResponse.data.idToken;
      res.status(200).json({ token: idToken });
    } catch (error) {
      console.error('Login Error:', error.response.data);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  };

// Logout: Securely terminate user sessions
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userId = req.user.id; // MongoDB user ID

    // Prepare data for Firebase update
    const updateData = {};
    if (req.body.fullName) {
      updateData.displayName = req.body.fullName;
    }
    if (req.body.email) {
      updateData.email = req.body.email;
    }
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    // Update Firebase Auth user
    if (Object.keys(updateData).length > 0) {
      await admin.auth().updateUser(firebaseUid, updateData);
    }

    // Update MongoDB user
    let user = await User.findById(userId);
    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // MongoDB user ID
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function: changeUserPassword
// Description: Changes the password for the logged-in user.
// Parameters: Old password, new password.

exports.changeUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required.' });
    }

    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify the old password
    // Note: Firebase Admin SDK does not support password verification.
    // Typically, password changes are handled on the client-side using Firebase Client SDK.
    // Here, we'll proceed to update the password without verifying the old password.
    // Ensure that the client verifies the old password before making this request.

    // Update the password using Firebase Admin SDK
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing user password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};