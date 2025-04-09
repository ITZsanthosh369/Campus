import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const SidebarLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for collapsing sidebar
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  // Navigation items based on user role
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
          { label: 'Assignments', icon: '📝', path: '/faculty/assignments' },
          { label: 'Announcements', icon: '📢', path: '/faculty/announcements' },
          { label: 'Circulars', icon: '📄', path: '/faculty/circulars' },
          { label: 'Queries', icon: '❓', path: '/faculty/queries' },
          { label: 'Profile', icon: '👤', path: '/profile' }
        ];
      case 'hod':
        return [
          { label: 'Dashboard', icon: '🏠', path: '/hod-dashboard' },
          { label: 'Department', icon: '🏢', path: '/hod/department' },
          { label: 'Faculty', icon: '👨‍🏫', path: '/hod/faculty' },
          { label: 'Announcements', icon: '📢', path: '/hod/announcements' },
          { label: 'Circulars', icon: '📄', path: '/hod/circulars' },
          { label: 'Broadcast', icon: '📡', path: '/hod/broadcast' },
          { label: 'Profile', icon: '👤', path: '/profile' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', icon: '🏠', path: '/admin-dashboard' },
          { label: 'User Management', icon: '👥', path: '/admin/users' },
          { label: 'Role Management', icon: '🔑', path: '/admin/roles' },
          { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
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

  // Get the first letter of first and last name for the avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return user.name[0];
  };

  return (
    <div className={styles.parentContainer}>
      {/* Mobile toggle button - Open sidebar */}
      <button 
        onClick={() => setSidebarOpen(true)} 
        className={styles.mobileToggle}
        aria-label="Open sidebar"
      >
        <span className={styles.hamburgerIcon}>☰</span>
      </button>
      
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarInner}>
          {/* TOP SECTION: Logo/Brand and User Info */}
          <div className={styles.topSection}>
            {/* Close button visible only on mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className={styles.closeSidebar}
              aria-label="Close sidebar"
            >
              <span>✕</span>
            </button>

            {/* Toggle collapse button for desktop */}
            <button
              onClick={toggleCollapse}
              className={styles.collapseToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span>{isCollapsed ? "›" : "‹"}</span>
            </button>

            {/* Logo/Brand */}
            <div className={styles.sidebarHeader}>
              <div className={styles.brandLogo}>CC</div>
              <h1 className={styles.brandText}>Campus Connect</h1>
            </div>
            
            {/* User Info in stylish card - Moved to top */}
            {user && (
              <div className={styles.userInfoCard}>
                <div className={styles.userAvatar}>{getUserInitials()}</div>
                <div className={styles.userDetails}>
                  <span className={styles.userInfoLabel}>Logged in as</span>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userRole}>{user.role}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* MIDDLE SECTION: Nav Links */}
          <nav className={styles.sidebarNav}>
            <ul className={styles.navList}>
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
          
          {/* BOTTOM SECTION: Logout button */}
          <div className={styles.sidebarFooter}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <span className={styles.logoutIcon}>🚪</span>
              <span className={styles.logoutText}>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Semi-transparent backdrop for mobile sidebar */}
      <div 
        className={`${styles.sidebarBackdrop} ${sidebarOpen ? styles.visible : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      {/* Main content area */}
      <main className={`${styles.mainContainer} ${isCollapsed ? styles.mainContainerExpanded : ''}`}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
