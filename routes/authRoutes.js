const express = require('express');
const User = require('../model/User');

const router = express.Router();

// Create a new user
router.post('/create-user', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.errorResponse.code === 11000) {
      res.status(400).json({ error: "duplicate phone or email" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Get all users
router.get('/users', async (req, res) => {
  const { phone } = req.query; // Extract the phone number from query parameters
  if (phone) {
    try {
      const user = await User.findOne({ phone });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'No user found with the provided phone number' });
      }
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const users = await User.find();
      if (users.length) {
        res.status(200).json(users);
      } else {
        res.status(200).json({ message: 'no user found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

//delete entry based on phone number
router.delete('/users', async (req, res) => {
  const { phone } = req.query; // Extract phone number from query parameters

  try {
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const deletedUser = await User.findOneAndDelete({ phone });
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } else {
      res.status(404).json({ message: 'No user found with the provided phone number' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update by provided field
router.patch('/users', async (req, res) => {
  const { phone } = req.query; // Extract phone number from query parameters
  const updates = req.body;    // Extract fields to update from the request body

  try {
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }
    const updatedUser = await User.findOneAndUpdate(
      { phone },                // Find the user by phone number
      { $set: updates },        // Update only the fields provided
      { new: true }             // Return the updated document
    );
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'No user found with the provided phone number' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
