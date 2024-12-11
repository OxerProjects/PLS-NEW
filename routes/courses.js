const express = require('express');
const User = require('../models/User');
const Course = require('../models/Cours');
const Lessons = require('../models/Lesson');
const Quizs = require('../models/Quiz');
const { ensureAuthenticated, ensureAdmin } = require('../config/auth'); // Updated path
const Lesson = require('../models/Lesson');

const router = express.Router();

router.get('/:courseId' , ensureAuthenticated ,async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId)  
      res.render('courses/course-details', { course });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user data');
    }
});

router.get('/:courseId/lesson/:lessonId/:lessonNum', ensureAuthenticated, async (req, res) => {
  const { courseId, lessonId, lessonNum } = req.params;
  
  try {
    const courseOrg = await Course.findById(courseId) 
    const course = await Course.findById(courseId).populate('lessons'); 
    const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
    
    if (!lesson) {
      return res.status(404).send('Lesson not found');
    } 
    res.render('courses/lesson', {lessonNum: parseInt(lessonNum) ,course: courseOrg , lesson });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching lesson data');
  }
});

module.exports = router;

  