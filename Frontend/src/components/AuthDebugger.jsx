import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A component to help debug authentication issues
 * Displays token information, authentication status, and troubleshooting tips
 */
const AuthDebugger = ({ showDetails = false }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [storedUserData, setStoredUserData] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  
  useEffect(() => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setStoredUserData(parsedData);
        
        // Basic token validation (check if exists and isn't expired)
        const token = parsedData?.token;
        if (token) {
          // Check if token appears to be valid JWT format
          const parts = token.split('.');
          if (parts.length === 3) {
            try {
              // Try to parse the payload
              const payload = JSON.parse(atob(parts[1]));
              // Check if token has an expiry and isn't expired
              const notExpired = !payload.exp || payload.exp * 1000 > Date.now();
              setTokenValid(notExpired);
            } catch (e) {
              setTokenValid(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }, [user]);

  // Only show in development environment
  if (process.env.NODE_ENV !== 'development' && !showDetails) {
    return null;
  }

  if (!expanded) {
    return (
      <div className="mt-4 p-2 bg-yellow-100 rounded-md text-sm">
        <button 
          className="text-blue-600 hover:underline" 
          onClick={() => setExpanded(true)}
        >
          Show Auth Debugger
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">Authentication Debugger</h3>
        <button 
          className="text-gray-600" 
          onClick={() => setExpanded(false)}
        >
          Hide
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 bg-white bg-opacity-50 rounded">
          <p><strong>Auth Context Status:</strong> {user ? '✅ User authenticated' : '❌ No user in context'}</p>
          <p><strong>LocalStorage Status:</strong> {storedUserData ? '✅ User data found' : '❌ No user data found'}</p>
          <p><strong>Token Status:</strong> {tokenValid ? '✅ Token appears valid' : '❌ Token invalid or expired'}</p>
        </div>

        {!user && (
          <div className="p-2 bg-red-100 rounded">
            <p className="font-medium">Login Issues Detected</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Check if server is running and accessible</li>
              <li>Verify login credentials (username/password)</li>
              <li>Check browser console for network errors</li>
              <li>Backend may be returning 401 errors (unauthorized)</li>
              <li>Try clearing localStorage and login again</li>
            </ul>
            <button 
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
              onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }}
            >
              Clear Auth Data & Reload
            </button>
          </div>
        )}

        {storedUserData && (
          <div className="mt-2">
            <p className="font-medium">Stored User Data:</p>
            <div className="p-2 bg-gray-100 rounded overflow-auto max-h-40 text-xs font-mono">
              <pre>{JSON.stringify(storedUserData, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebugger;
