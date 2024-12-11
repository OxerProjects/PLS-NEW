//router.get('/:courseId/lesson/:lessonId/:lessonNum/quiz', ensureAuthenticated, async (req, res) => {
//  const { courseId, lessonId, lessonNum } = req.params;
//  try {
//    const course = await Course.findById(courseId).populate('lessons');
//    const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
//
//    if (!lesson) {
//      return res.status(404).send('Lesson not found');
//    }
//    const quiz = await Lesson.findById(lessonId).populate('questions');
//
//    if (!quiz) {
//      return res.status(404).send('Quiz not found');
//    }
//
//    res.render('courses/quiz', { quiz, course,courseId, lessonId, lessonNum: parseInt(lessonNum, 10) });
//  } catch (err) {
//    console.error(err);
//    res.status(500).send('Error fetching quiz data');
//  }
//});
//
//
//router.post('/:courseId/lesson/:lessonId/:lessonNum/quiz', ensureAuthenticated, async (req, res) => {
//  const { courseId, lessonId, lessonNum } = req.params;
//  const submittedAnswers = req.body;
//  const maxAttempts = 3;
//
//  if (!req.session.attempts) req.session.attempts = {};
//
//  if (!req.session.attempts[lessonId]) req.session.attempts[lessonId] = 0;
//
//  try {
//    const course = await Course.findById(courseId)
//    const quiz = await Lesson.findOne({ _id: lessonId }).populate('questions');
//
//    if (!quiz) {
//      return res.status(404).send('Quiz not found');
//    }
//
//    const results = quiz.questions.map(question => {
//      const submittedAnswer = submittedAnswers[question._id.toString()];
//      return {
//        questionId: question._id,
//        correct: question.correctAnswer === submittedAnswer,
//      };
//    });
//
//    const allCorrect = results.every(result => result.correct);
//
//    if (allCorrect) {
//      req.session.attempts[lessonId] = 0;
//
//      // Redirect to the next lesson
//      const nextLessonNum = parseInt(lessonNum) + 1;
//      res.redirect(`/${courseId}/lesson/${course.lessons[nextLessonNum]}/${nextLessonNum}`);
//    } else {
//      // Increment the attempt count
//      req.session.attempts[lessonId] += 1;
//
//      if (req.session.attempts[lessonId] >= maxAttempts) {
//        // If max attempts are reached, redirect to the previous lesson
//        const prevLessonNum = parseInt(lessonNum);
//        req.session.attempts[lessonId] = 0; // Reset attempts
//        res.redirect(`/${courseId}/lesson/${course.lessons[prevLessonNum]}/${prevLessonNum}`);
//      } else {
//        // Allow another attempt
//        res.render('courses/quiz', {
//          quiz,
//          message: `Incorrect answers. You have ${maxAttempts - req.session.attempts[lessonId]} attempt(s) remaining.`,
//        });
//      }
//    }
//  } catch (err) {
//    console.error(err);
//    res.status(500).send('Error submitting quiz');
//  }
//});