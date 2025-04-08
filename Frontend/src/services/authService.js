import api from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/profile',
};

/**
 * Login user with email and password
 */
const login = async (email, password) => {
  try {
    const { data } = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Invalid email or password'
    );
  }
};

/**
 * Register a new user
 */
const register = async (userData) => {
  try {
    const { data } = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to register user'
    );
  }
};

/**
 * Update user profile
 */
const updateProfile = async (userData) => {
  try {
    const { data } = await api.put(AUTH_ENDPOINTS.PROFILE, userData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile'
    );
  }
};

/**
 * Get current user profile
 */
const getProfile = async () => {
  try {
    const { data } = await api.get(AUTH_ENDPOINTS.PROFILE);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch profile'
    );
  }
};

const authService = {
  login,
  register,
  updateProfile,
  getProfile,
};

export default authService;
