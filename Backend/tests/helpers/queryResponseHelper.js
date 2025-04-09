const mongoose = require('mongoose');
const { createTestCourseGroup } = require('../testUtils');

/**
 * Setup test data for query response tests
 * @param {Object} data - Optional override data
 * @returns {Promise<Object>} The created test data
 */
const setupQueryTestData = async (data = {}) => {
  // Create a course group with all required fields to avoid validation errors
  const courseGroup = await createTestCourseGroup({
    faculty: data.facultyId || new mongoose.Types.ObjectId(),
    ...data
  });
  
  return { courseGroup };
};

module.exports = {
  setupQueryTestData
};
