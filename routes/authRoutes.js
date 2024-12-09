const express = require('express');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../authenticateToken');

const SECRET_KEY = '123'; 

const router = express.Router();

// Create a new user
router.post('/create-user', async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }


  try {
    if (req.body.phone.length === 10) {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    }else{
      return res.status(400).json({ message: 'phone number is not valid' });
    }
  } catch (error) {
    if (error.errorResponse.code === 11000) {
      res.status(400).json({ error: "duplicate phone or email" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Get all users
router.get('/users',authenticateToken, async (req, res) => {
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

//forgot password for user
router.post('/forgotpassword', async (req, res) => {
  const { phone, city } = req.body; // Extract the phone number from query parameters
  
    try {
      const user = await User.findOne({ phone, city });
      if (user) {
        res.status(200).json({"password": user.password});
      } else {
        res.status(404).json({ message: 'No user found ' });
      }
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//login api
router.post('/login', async (req, res) => {
  const { phone, password } = req.body; // Extract the phone number from query parameters
  
    try {
      const user = await User.findOne({ phone, password});
      if (user) {
        const token = jwt.sign({ userId: user.phone }, SECRET_KEY, { expiresIn: '2m' });
        res.status(200).json({ message: `Hello ${user.firstName}`, token : token});
      } else {
        res.status(404).json({ message: 'Authentication failed' });
      }
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;
