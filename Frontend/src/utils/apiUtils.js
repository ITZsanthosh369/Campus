import axios from 'axios';

/**
 * Creates an axios instance with the auth token from localStorage
 */
const createAuthAxios = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: user.token ? `Bearer ${user.token}` : '',
    },
    withCredentials: true,  // Add this line to send cookies with requests
  });
};

/**
 * Fetch data from API with authentication
 * @param {string} url - API endpoint
 * @param {Object} options - Axios request options
 * @returns {Promise<{data, error}>} - Response data or error
 */
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const authAxios = createAuthAxios();
    
    // Remove duplicate /api/v1 prefix if present
    const cleanUrl = url.startsWith('/api/v1') ? url.substring(7) : url;
    
    // Log the complete URL being called for debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Request to: ${authAxios.defaults.baseURL}${cleanUrl}`);
    }
    
    const response = await authAxios(cleanUrl, options);
    
    // Debug response structure in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Response (${cleanUrl}):`, response.data);
    }
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      // Could redirect to login page or refresh token
      console.warn('Authentication token expired or invalid');
    }
    
    return { 
      data: null, 
      error: error.response?.data?.message || error.message || 'An error occurred'
    };
  }
};
