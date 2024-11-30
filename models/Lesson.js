const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
});

module.exports = mongoose.model('Lesson', LessonSchema);
