require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

// Initialize app
const app = express();

// Passport Configuration
const initializePassport = require('./config/passport');
const { ensureAuthenticated, ensureAdmin } = require('./config/auth');

// Import Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const coursesRoutes = require('./routes/courses');

// Import Models
const User = require('./models/User');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));

// Session and Flash Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.layout = 'layouts/layout'; // Default layout
  next();
});

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Initialize Passport
initializePassport(passport);

// Routes with Dynamic Layouts
app.use('/', (req, res, next) => {
  res.locals.layout = 'layouts/layout'; // Layout for auth routes
  next();
}, authRoutes);

app.use('/courses', ensureAuthenticated, (req, res, next) => {
  res.locals.layout = 'layouts/studentLayout'; // Layout for courses
  next();
}, coursesRoutes);

app.use('/admin', ensureAuthenticated, ensureAdmin, (req, res, next) => {
  res.locals.layout = 'layouts/adminLayout'; // Layout for admin routes
  next();
}, adminRoutes);

// Home Page
app.get('/home', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('courses');
    res.render('home', {
      user,
      layout: 'layouts/studentLayout', // Explicit layout for home page
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user data');
  }
});

// Default Route
app.get('/', (req, res) => {
  res.render('index', { layout: 'layouts/mainLayout' }); // Explicit layout
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
