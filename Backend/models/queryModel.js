const mongoose = require('mongoose');

const querySchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseGroup',
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'answered', 'closed'],
      default: 'pending',
    },
    response: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
