require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const app = express();

//Passport
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const initializePassport = require('./config/passport');
const { ensureAuthenticated, ensureAdmin } = require('./config/auth'); // Updated path

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));

// Session and Flash Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.set('views', __dirname + '/views');

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Passport
initializePassport(passport);

//Index
app.get('/', (req, res) => {
  res.render('index');
});

// Routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

// Protected Route
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
