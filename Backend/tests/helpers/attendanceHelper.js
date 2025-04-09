const mongoose = require('mongoose');
const { mapToObjectIds } = require('../testUtils');

/**
 * Fix the common ObjectId mapping issue in attendance tests
 * @param {Array} students - The student array
 * @returns {Array} Array with proper ObjectIds
 */
const mapStudentsToObjectIds = (students) => {
  return mapToObjectIds(students, 'id');
};

module.exports = {
  mapStudentsToObjectIds
};
