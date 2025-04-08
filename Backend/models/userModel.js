const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'hod', 'principal', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      required: true,
    },
    classGroup: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
    },
    batch: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
    },
    year: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
    },
    profileImage: {
      type: String,
      default: 'default-profile.png',
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
