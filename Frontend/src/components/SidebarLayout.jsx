import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarOpen && 
          !event.target.closest(`.${styles.sidebar}`) && 
          !event.target.closest(`.${styles.mobileToggle}`)) {
        setSidebarOpen(false);
      }
    };

    // Add class to prevent body scrolling when sidebar is open on mobile
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  // Navigation items based on user role (simplified example)
  const getNavItems = () => {
    if (!user) return [];
    
    switch(user.role) {
      case 'student':
        return [
          { label: 'Dashboard', icon: '🏠', path: '/student-dashboard' },
          { label: 'My Classes', icon: '📚', path: '/student/classes' },
          { label: 'Assignments', icon: '📝', path: '/student/assignments' },
          { label: 'Announcements', icon: '📢', path: '/student/announcements' },
          { label: 'Circulars', icon: '📄', path: '/student/circulars' },
          { label: 'Queries', icon: '❓', path: '/student/queries' },
          { label: 'Profile', icon: '👤', path: '/profile' }
        ];
      case 'faculty':
        return [
          { label: 'Dashboard', icon: '🏠', path: '/faculty-dashboard' },
          { label: 'My Classes', icon: '📚', path: '/faculty/classes' },
          { label: 'Announcements', icon: '📢', path: '/faculty/announcements' },
          { label: 'Circulars', icon: '📄', path: '/faculty/circulars' },
          { label: 'Profile', icon: '👤', path: '/profile' }
        ];
      default:
        return [
          { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
          { label: 'Profile', icon: '👤', path: '/profile' }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className={styles.parentContainer}>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className={styles.mobileToggle}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="mb-4 mt-4 flex items-center justify-center">
            <div className="bg-white text-indigo-600 p-2 rounded-md text-xl font-bold mr-2">CC</div>
            <h1 className="text-xl font-bold">Campus Connect</h1>
          </div>
          
          {/* Nav Links */}
          <nav className="flex-grow">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({isActive}) => 
                      `${styles.navItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                    data-title={item.label}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navText}>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User Info at Bottom */}
          {user && (
            <div className={styles.sidebarFooter}>
              <div className={styles.sidebarUserInfo}>
                <p>Logged in as:</p>
                <p className={styles.sidebarUserName}>{user.name}</p>
                <p className={styles.sidebarUserRole}>{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Semi-transparent backdrop for mobile sidebar */}
      <div className={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)}></div>
      
      {/* Main content area */}
      <div className={styles.mainContainer}>
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
