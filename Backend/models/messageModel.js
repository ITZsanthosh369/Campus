const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    groupType: {
      type: String,
      enum: ['Department', 'ClassGroup', 'CourseGroup'],
      required: true,
      index: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      // We'll determine the ref dynamically based on groupType
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for faster queries when fetching messages for a specific group
messageSchema.index({ groupType: 1, groupId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
