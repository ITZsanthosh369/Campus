import api from './api';
import { fetchWithAuth } from '../utils/apiUtils';

// Faculty Classes and Courses
export const getMyClasses = async () => {
  return fetchWithAuth('/users/my-classes');
};

// Announcements
export const createAnnouncement = async (announcementData) => {
  return fetchWithAuth('/announcements', {
    method: 'POST',
    data: announcementData
  });
};

export const getAnnouncements = async () => {
  return fetchWithAuth('/announcements');
};

// Circulars
export const uploadCircular = async (circularData) => {
  // For file uploads, we need to use FormData
  const formData = new FormData();
  
  // Add file to form data
  if (circularData.file) {
    formData.append('file', circularData.file);
  }
  
  // Add other fields
  formData.append('title', circularData.title);
  formData.append('description', circularData.description);
  formData.append('targetRoles', circularData.targetRoles || 'all');
  
  if (circularData.targetDepartments) {
    formData.append('targetDepartments', JSON.stringify(circularData.targetDepartments));
  }

  // Use direct api call for FormData
  return api.post('/announcements/circulars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCirculars = async () => {
  return fetchWithAuth('/announcements/circulars');
};

// Student Queries
export const getStudentQueries = async (courseId = null) => {
  const url = courseId ? `/queries?courseId=${courseId}` : '/queries';
  return fetchWithAuth(url);
};

export const respondToQuery = async (queryId, responseData) => {
  return fetchWithAuth(`/queries/${queryId}`, {
    method: 'PATCH',
    data: responseData
  });
};

// Assignments
export const createAssignment = async (assignmentData) => {
  return fetchWithAuth('/assignments', {
    method: 'POST',
    data: assignmentData
  });
};

export const getAssignments = async () => {
  return fetchWithAuth('/assignments');
};

// Submissions
export const getSubmissions = async (assignmentId) => {
  return fetchWithAuth(`/submissions?assignmentId=${assignmentId}`);
};

export const gradeSubmissions = async (gradeData) => {
  return fetchWithAuth('/submissions/grade', {
    method: 'POST',
    data: gradeData
  });
};

// Attendance
export const markAttendance = async (attendanceData) => {
  return fetchWithAuth('/attendance', {
    method: 'POST',
    data: attendanceData
  });
};

export const getAttendance = async (courseId, date) => {
  let url = '/attendance?';
  if (courseId) url += `courseId=${courseId}`;
  if (date) url += `&date=${date}`;
  
  return fetchWithAuth(url);
};

// Faculty Activities
export const getFacultyActivities = async () => {
  return fetchWithAuth('/users/activities');
};
