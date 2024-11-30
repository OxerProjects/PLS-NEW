const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  quizText: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model('Quiz', QuizSchema);
