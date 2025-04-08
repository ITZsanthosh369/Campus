import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="bg-white text-indigo-600 p-1 rounded-md mr-2">CC</span>
          Campus Connect
        </Link>
        {user ? (
          <div className="flex items-center">
            <span className="mr-4">Hello, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="bg-white text-indigo-600 px-3 py-1 rounded-md">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
