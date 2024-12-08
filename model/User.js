const mongoose = require('mongoose');

// Define a schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone : { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: false },
});

// Create a model
const User = mongoose.model('User', UserSchema);

module.exports = User;
