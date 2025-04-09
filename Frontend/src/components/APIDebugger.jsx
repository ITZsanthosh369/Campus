import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component to debug API connectivity issues
 */
const APIDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    hasToken: false,
    tokenValue: null,
    tokenExpiry: null,
    userObject: null
  });
  const { user } = useAuth();

  // Only render in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Basic token parsing if it exists (not full JWT validation)
      let expiry = null;
      if (storedUser.token) {
        try {
          const tokenParts = storedUser.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            expiry = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Not found';
          }
        } catch (e) {
          expiry = 'Error parsing token';
        }
      }
      
      setAuthStatus({
        hasToken: !!storedUser.token,
        tokenValue: storedUser.token ? `${storedUser.token.substring(0, 15)}...` : 'No token',
        tokenExpiry: expiry,
        userObject: storedUser
      });
    }
  }, [isOpen, user]);

  return (
    <div className="mt-8 border border-gray-300 rounded-lg">
      <div 
        className="bg-gray-100 p-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-mono">API Connection Debugger</h3>
        <button className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-gray-50">
          <div className="mb-4">
            <h4 className="font-bold">Authentication Status:</h4>
            <p className={`text-sm ${authStatus.hasToken ? 'text-green-600' : 'text-red-600'}`}>
              Token Present: {authStatus.hasToken ? 'Yes' : 'No'}
            </p>
            {authStatus.hasToken && (
              <>
                <p className="text-sm mt-1">Token (preview): {authStatus.tokenValue}</p>
                <p className="text-sm mt-1">Expiry: {authStatus.tokenExpiry}</p>
              </>
            )}
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold">API Configuration:</h4>
            <p className="text-sm">Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}</p>
          </div>

          <div>
            <h4 className="font-bold">Tips for API Issues:</h4>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Check that your backend server is running on the correct port</li>
              <li>Verify the API base URL matches your server configuration</li>
              <li>Confirm token is present and not expired</li>
              <li>Check browser console for CORS errors</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIDebugger;
