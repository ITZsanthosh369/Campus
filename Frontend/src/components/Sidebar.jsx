import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Navigation items for Students
  const studentNavItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      path: '/student-dashboard'
    },
    {
      label: 'My Classes',
      icon: '📚',
      path: '/student/classes'
    },
    {
      label: 'Assignments',
      icon: '📝',
      path: '/student/assignments'
    },
    {
      label: 'Announcements',
      icon: '📰',
      path: '/student/announcements'
    },
    {
      label: 'Circulars',
      icon: '📄',
      path: '/student/circulars'
    },
    {
      label: 'Queries',
      icon: '❓',
      path: '/student/queries'
    }
  ];

  // Navigation items for Faculty
  const facultyNavItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      path: '/faculty-dashboard'
    },
    {
      label: 'My Classes',
      icon: '📚',
      path: '/faculty/classes'
    },
    {
      label: 'Announcements',
      icon: '📰',
      path: '/faculty/announcements'
    },
    {
      label: 'Circulars',
      icon: '📄',
      path: '/faculty/circulars'
    }
  ];
  
  // Navigation items for HOD
  const hodNavItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      path: '/hod-dashboard'
    },
    {
      label: 'Department',
      icon: '🏢',
      path: '/hod/department'
    },
    {
      label: 'Announcements',
      icon: '📢',
      path: '/hod/announcements'
    },
    {
      label: 'Circulars',
      icon: '📄',
      path: '/hod/circulars'
    },
    {
      label: 'Broadcast Message',
      icon: '📣',
      path: '/hod/broadcast'
    }
  ];

  // Navigation items for Principal
  const principalNavItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      path: '/principal-dashboard'
    },
    {
      label: 'Role Management',
      icon: '👥',
      path: '/principal/role-management'
    },
    {
      label: 'Announcements',
      icon: '📢',
      path: '/principal/announcements'
    },
    {
      label: 'Circulars',
      icon: '📄',
      path: '/principal/circulars'
    },
    {
      label: 'Broadcast Message',
      icon: '📣',
      path: '/principal/broadcast'
    }
  ];
  
  // Select the appropriate navigation items based on user role
  let navItems = studentNavItems;
  
  if (user?.role === 'faculty') {
    navItems = facultyNavItems;
  } else if (user?.role === 'hod') {
    navItems = hodNavItems;
  } else if (user?.role === 'principal') {
    navItems = principalNavItems;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed top-4 left-4 z-20 bg-indigo-600 text-white p-2 rounded-md"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-indigo-800 text-white w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="mb-8 mt-4 flex items-center justify-center">
            <div className="bg-white text-indigo-600 p-2 rounded-md text-xl font-bold mr-2">CC</div>
            <h1 className="text-xl font-bold">Campus Connect</h1>
          </div>
          
          {/* Nav Links */}
          <nav className="flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({isActive}) => 
                      `flex items-center p-3 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-indigo-700 text-white' 
                          : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User Info at Bottom */}
          <div className="border-t border-indigo-700 pt-4 mt-4">
            <div className="text-sm text-indigo-200">
              <p>Logged in as:</p>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
