const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Lessons = require('../models/Lesson');
const Quizs = require('../models/Quiz');

const { ensureAuthenticated, ensureAdmin } = require('../config/auth'); // Updated path
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const users = await User.find({ isAdmin: false }); // Exclude admins
  const courses = await Course.find();
  const lessons = await Lessons.find();
  const quizs = await Quizs.find();
  res.render('admin/dashboard', { admin: req.user, users, courses, lessons, quizs });
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

// Add Course
router.get('/add-course', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const lessons = await Lesson.find();  // Fetch lessons from the database
    res.render('admin/course/add-course', { lessons });
  } catch (err) {
    req.flash('error_msg', 'Error fetching lessons');
    res.redirect('/admin/dashboard');
  }
});

router.post('/add-course', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { title, description, lessons } = req.body;

  try {
    const newCourse = new Course({
      title,
      description,
      lessons: lessons || []  // lessons is an array, can be empty if no lessons are selected
    });

    // Save the new course to the database
    await newCourse.save();
    res.redirect('/admin/dashboard');  // Redirect to course management page
  } catch (err) {
    req.flash('error_msg', 'Error adding course');
    res.redirect('/admin/dashboard');
  }
});

// Add Lesson
router.get('/add-lesson', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const quizs = await Quiz.find();  // Fetch quizzes from the database
    res.render('admin/course/add-lesson', { quizs });
  } catch (err) {
    req.flash('error_msg', 'Error fetching quizzes');
    res.redirect('/admin/dashboard');
  }
});

router.post('/add-lesson', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { title, content, quizs } = req.body;

  try {
    const newLesson = new Lesson({
      title,
      content,
      questions: quizs || []  // quizs is an array, can be empty if no quizzes are selected
    });

    // Save the new lesson to the database
    await newLesson.save();
    res.redirect('/admin/dashboard');  // Redirect to course management page
  } catch (err) {
    req.flash('error_msg', 'Error adding lesson');
    res.redirect('/admin/dashboard');
  }
});


//Add Quiz
router.get('/add-quiz', ensureAuthenticated, ensureAdmin, async (req, res) => {
  res.render('admin/course/add-quiz');
});

router.post('/add-quiz', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { quizText, option1, option2, option3, option4, correctAnswer } = req.body;

  try {
    // Create a new quiz document with the options as an array
    const newQuiz = new Quiz({
      quizText,
      answers: [option1, option2, option3, option4],  // Options are stored as an array
      correctAnswer  // The correct answer, one of the options
    });

    // Save the quiz to the database using async/await
    await newQuiz.save();

    // Redirect to the dashboard after successful quiz creation
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.log("Error adding quiz:", err);  // Log errors for debugging
    req.flash('error_msg', 'Error adding quiz');
    res.redirect('/admin/dashboard');
  }
});


module.exports = router;
