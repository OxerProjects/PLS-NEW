const express = require('express');
const Course = require('../models/Cours');
const Lesson = require('../models/Lesson');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

// Middleware to set student layout
router.use((req, res, next) => {
  res.locals.layout = 'layouts/studentLayout'; // Use student layout for all course routes
  next();
});

// Get Course Details
router.get('/:courseId', ensureAuthenticated, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('lessons');
    if (!course) {
      req.flash('error_msg', 'Course not found');
      return res.redirect('/home');
    }
    res.render('courses/course-details', { course });
  } catch (err) {
    console.error('Error fetching course data:', err);
    req.flash('error_msg', 'Error fetching course details');
    res.redirect('/home');
  }
});

// Get Lesson Details
router.get('/:courseId/lesson/:lessonId/:lessonNum', ensureAuthenticated, async (req, res) => {
  const { courseId, lessonId, lessonNum } = req.params;

  try {
    const course = await Course.findById(courseId).populate('lessons');
    if (!course) {
      req.flash('error_msg', 'Course not found');
      return res.redirect('/home');
    }

    const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
    if (!lesson) {
      req.flash('error_msg', 'Lesson not found');
      return res.redirect(`/courses/${courseId}`);
    }

    res.render('courses/lesson', { lessonNum: parseInt(lessonNum), course, lesson });
  } catch (err) {
    console.error('Error fetching lesson data:', err);
    req.flash('error_msg', 'Error fetching lesson details');
    res.redirect(`/courses/${courseId}`);
  }
});

module.exports = router;
