const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('Course', CourseSchema);
