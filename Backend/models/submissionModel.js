const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submissionText: {
      type: String,
      required: true,
    },
    submissionTitle: {
      type: String,
      required: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    marks: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    isGraded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
