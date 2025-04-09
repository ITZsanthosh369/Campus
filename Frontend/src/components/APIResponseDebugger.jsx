import React, { useState } from 'react';

/**
 * Component to debug API responses (only visible in development)
 */
const APIResponseDebugger = ({ data, title = "API Response" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Only render in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-8 border border-gray-300 rounded-lg">
      <div 
        className="bg-gray-100 p-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-mono">{title}</h3>
        <button className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 overflow-auto max-h-96">
          <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default APIResponseDebugger;
