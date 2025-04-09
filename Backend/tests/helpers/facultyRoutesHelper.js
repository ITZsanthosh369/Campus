const { getTestAssignmentModel } = require('../testUtils');

/**
 * Setup models for faculty routes tests
 * Import this at the beginning of your facultyRoutes.test.js file
 * @returns {Object} The required models
 */
const setupFacultyModels = () => {
  // Pre-define all models to avoid the "cannot overwrite model" error
  const Assignment = getTestAssignmentModel();
  
  return { Assignment };
};

module.exports = {
  setupFacultyModels
};
