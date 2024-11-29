const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login route
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  // After login, check if the user is an admin
  if (req.user.isAdmin) {
    // If the user is an admin, redirect to the admin dashboard
    return res.redirect('/admin/dashboard');
  } else {
    // Otherwise, redirect to the regular user dashboard or homepage
    return res.redirect('/dashboard');
  }
});


// Logout User
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;
