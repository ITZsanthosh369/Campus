const asyncHandler = require('express-async-handler');
const ClassGroup = require('../models/classGroupModel');
const CourseGroup = require('../models/courseGroupModel');

/**
 * @desc    Assign a course to a class group
 * @route   POST /api/v1/groups/assign-course
 * @access  Private/ProgramCoordinator,Admin
 */
const assignCourseToClassGroup = asyncHandler(async (req, res) => {
  const { courseCode, courseName, semester, facultyId, classGroupId } = req.body;
  const user = req.user;

  // Basic validation
  if (!courseCode || !courseName || !semester || !facultyId || !classGroupId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Fetch the class group
    const classGroup = await ClassGroup.findById(classGroupId);
    
    if (!classGroup) {
      res.status(404);
      throw new Error('Class group not found');
    }

    // Verify coordinator permission
    if (user.role === 'faculty' && 
        (!classGroup.programCoordinator || 
         !classGroup.programCoordinator.equals(user._id))) {
      res.status(403);
      // Change error message to match the expected pattern in the test
      throw new Error('Faculty not allowed to modify class groups they are not coordinating');
    }

    // Create a new course group
    const courseGroup = await CourseGroup.create({
      courseCode,
      courseName,
      semester,
      faculty: facultyId,
      classGroup: classGroupId,
      students: classGroup.students // Copy students from class group
    });

    if (courseGroup) {
      res.status(201).json({
        success: true,
        message: 'Course assigned to class group successfully',
        courseGroup,
      });
    } else {
      res.status(400);
      throw new Error('Invalid course data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
});

module.exports = {
  assignCourseToClassGroup,
};
