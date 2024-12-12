const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Cours');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth');

const router = express.Router();

// Middleware to set admin layout
router.use((req, res, next) => {
  res.locals.layout = 'layouts/adminLayout'; // Use admin layout for all admin routes
  next();
});

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }); // Exclude admins
    const courses = await Course.find();
    const lessons = await Lesson.find();
    const quizs = await Quiz.find();
    res.render('admin/dashboard', { admin: req.user, users, courses, lessons, quizs });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    req.flash('error_msg', 'Error fetching dashboard data');
    res.redirect('/');
  }
});

// Add User
router.get('/add-user', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('admin/user/add-user', { courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    req.flash('error_msg', 'Error loading add user page');
    res.redirect('/admin/dashboard');
  }
});

router.post('/add-user', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { username, password, courseId, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      courses: courseId || [],
      isAdmin,
    });
    await newUser.save();
    req.flash('success_msg', 'User added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding user:', err);
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
    console.error('Error updating user:', err);
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
    console.error('Error deleting user:', err);
    req.flash('error_msg', 'Error deleting user');
    res.redirect('/admin/dashboard');
  }
});

// Add Course
router.get('/add-course', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.render('admin/course/add-course', { lessons });
  } catch (err) {
    console.error('Error fetching lessons:', err);
    req.flash('error_msg', 'Error loading add course page');
    res.redirect('/admin/dashboard');
  }
});

router.post('/add-course', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { title, description, lessons } = req.body;
  try {
    const newCourse = new Course({
      title,
      description,
      lessons: lessons || [],
    });
    await newCourse.save();
    req.flash('success_msg', 'Course added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding course:', err);
    req.flash('error_msg', 'Error adding course');
    res.redirect('/admin/dashboard');
  }
});

// Add Lesson
router.get('/add-lesson', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const quizs = await Quiz.find();
    res.render('admin/course/add-lesson', { quizs });
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    req.flash('error_msg', 'Error loading add lesson page');
    res.redirect('/admin/dashboard');
  }
});

router.post('/add-lesson', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { title, content, quizs } = req.body;
  try {
    const newLesson = new Lesson({
      title,
      content,
      questions: quizs || [],
    });
    await newLesson.save();
    req.flash('success_msg', 'Lesson added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding lesson:', err);
    req.flash('error_msg', 'Error adding lesson');
    res.redirect('/admin/dashboard');
  }
});

// Add Quiz
router.get('/add-quiz', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('admin/course/add-quiz');
});

router.post('/add-quiz', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { quizText, option1, option2, option3, option4, correctAnswer } = req.body;
  try {
    const newQuiz = new Quiz({
      quizText,
      answers: [option1, option2, option3, option4],
      correctAnswer,
    });
    await newQuiz.save();
    req.flash('success_msg', 'Quiz added successfully');
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding quiz:', err);
    req.flash('error_msg', 'Error adding quiz');
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;
