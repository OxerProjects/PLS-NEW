const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth'); // Updated path

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const users = await User.find({ isAdmin: false }); // Exclude admins
  res.render('admin/dashboard', { admin: req.user, users });
});

// Add User
router.post('/add-user', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword});
    await newUser.save();
    req.flash('success_msg', 'User added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Error adding user');
    res.redirect('/admin/dashboard');
  }
});

// Edit User
router.post('/edit-user/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { username } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { username });
    req.flash('success_msg', 'User updated successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Error updating user');
    res.redirect('/admin/dashboard');
  }
});

// Delete User
router.post('/delete-user/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Error deleting user');
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;
