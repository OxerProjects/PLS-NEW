const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function(passport) {
  // Passport session setup
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store user id in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Find user by ID
      done(null, user); // Attach user to request object
    } catch (err) {
      done(err, null);
    }
  });

  // Local login strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username', // Field for username
        passwordField: 'password', // Field for password
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });

          if (!user) {
            return done(null, false, { message: 'No user found' });
          }

          // Check if password matches
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }

          // Successfully authenticated user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
