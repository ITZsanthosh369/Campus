import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';
import { fetchWithAuth } from '../utils/apiUtils';
import styles from '../styles/StudentClasses.module.css'; // Updated to use CSS modules

const StudentClasses = () => {
  const { user } = useAuth();
  const [classesData, setClassesData] = useState({ classGroups: [], courseGroups: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add new state variables for faculty modal
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [selectedClassGroupName, setSelectedClassGroupName] = useState('');
  // Renamed from showChat to isChatModalOpen for consistency
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState(null);

  // Mock faculty list for the modal
  const mockFacultyList = [
    { name: "Dr. Rajesh Sharma", role: "Program Coordinator" },
    { name: "Prof. Anita Desai", role: "Mathematics" },
    { name: "Dr. Michael Chen", role: "Computer Science" },
    { name: "Prof. Sunita Patel", role: "Engineering Sciences" },
    { name: "Dr. David Wilson", role: "Physics" }
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Update API call to remove duplicate /api/v1 prefix
        const { data, error } = await fetchWithAuth('/users/my-classes');
        
        if (error) {
          throw new Error(error);
        }
        
        // Ensure we're accessing the correct properties in the response
        setClassesData({
          classGroups: data?.classGroups || [],
          courseGroups: data?.courseGroups || []
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError(err.message || 'Failed to fetch classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Function to handle opening chat for a specific group
  const handleOpenChat = (group, type) => {
    setSelectedGroup(group);
    setSelectedGroupType(type);
    setIsChatModalOpen(true);
  };

  // Function to close chat
  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setSelectedGroup(null);
    setSelectedGroupType(null);
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className={styles.classesContainer}>
        <header className={styles.classesHeader}>
          <h1>My Classes</h1>
        </header>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  // Update the condition to check for empty arrays properly
  if (!loading && (!classesData.classGroups?.length && !classesData.courseGroups?.length)) {
    return (
      <div className={styles.classesContainer}>
        <header className={styles.classesHeader}>
          <h1>My Classes</h1>
          <div className={styles.emptyState}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className={styles.emptyStateMessage}>No classes or courses found.</p>
            <p className={styles.emptyStateHelp}>Please contact academic administration if this seems incorrect.</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.classesContainer}>
      <header className={styles.classesHeader}>
        <h1>My Classes</h1>
        <p>Classes and courses you are enrolled in</p>
      </header>

      {/* Class Groups Section */}
      {classesData.classGroups?.length > 0 && (
        <>
          <h2 className={styles.sectionHeader}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Class Groups
          </h2>
          <div className={styles.classCardsGrid}>
            {classesData.classGroups.map((classGroup) => (
              <div key={classGroup._id} className={styles.classCard}>
                <div className={styles.classCardHeader}>
                  <h3 className={styles.classCardTitle}>{classGroup.name}</h3>
                  <span className={`${styles.classCardTag} ${styles.classGroupTag}`}>{classGroup.userRole}</span>
                </div>
                <div className={styles.classCardBody}>
                  <div className={styles.classDetails}>
                    <div className={styles.classDetail}>
                      <span className={styles.classDetailLabel}>Year:</span>
                      <span className={styles.classDetailValue}>{classGroup.year}</span>
                    </div>
                    <div className={styles.classDetail}>
                      <span className={styles.classDetailLabel}>Batch:</span>
                      <span className={styles.classDetailValue}>{classGroup.batch}</span>
                    </div>
                    <div className={styles.classDetail}>
                      <span className={styles.classDetailLabel}>Department:</span>
                      <span className={styles.classDetailValue}>{classGroup.department}</span>
                    </div>
                    {classGroup.tutor && (
                      <div className={styles.classDetail}>
                        <span className={styles.classDetailLabel}>Tutor:</span>
                        <span className={styles.classDetailValue}>{classGroup.tutor.name}</span>
                      </div>
                    )}
                    {classGroup.programCoordinator && (
                      <div className={styles.classDetail}>
                        <span className={styles.classDetailLabel}>Coordinator:</span>
                        <span className={styles.classDetailValue}>{classGroup.programCoordinator.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.classCardFooter}>
                  <button 
                    onClick={() => {
                      setSelectedClassGroupName(classGroup.name);
                      setIsFacultyModalOpen(true);
                    }}
                    className="btn btn-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Faculty
                  </button>
                  <button
                    onClick={() => handleOpenChat(classGroup, 'ClassGroup')}
                    className="btn btn-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Course Groups Section */}
      {classesData.courseGroups?.length > 0 && (
        <>
          <h2 className={styles.sectionHeader}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Course Groups
          </h2>
          <div className={styles.classCardsGrid}>
            {classesData.courseGroups.map((course) => (
              <div key={course._id} className={styles.classCard}>
                <div className={styles.classCardHeader}>
                  <h3 className={styles.classCardTitle}>{course.courseCode}</h3>
                  <span className={`${styles.classCardTag} ${styles.courseTag}`}>{course.userRole}</span>
                </div>
                <div className={styles.classCardBody}>
                  <h4 className={styles.classCardSubtitle}>{course.courseName}</h4>
                  <div className={styles.classDetails}>
                    <div className={styles.classDetail}>
                      <span className={styles.classDetailLabel}>Semester:</span>
                      <span className={styles.classDetailValue}>{course.semester}</span>
                    </div>
                    {course.faculty && (
                      <div className={styles.classDetail}>
                        <span className={styles.classDetailLabel}>Faculty:</span>
                        <span className={styles.classDetailValue}>{course.faculty.name}</span>
                      </div>
                    )}
                    {course.classGroup && (
                      <div className={styles.classDetail}>
                        <span className={styles.classDetailLabel}>Class:</span>
                        <span className={styles.classDetailValue}>{course.classGroup.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.classCardFooter}>
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Details
                  </button>
                  <button
                    onClick={() => handleOpenChat(course, 'CourseGroup')}
                    className="btn btn-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Faculty Modal */}
      {isFacultyModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                Faculty for {selectedClassGroupName}
              </h2>
            </div>
            <ul className="faculty-list">
              {mockFacultyList.map((faculty, index) => (
                <li key={index} className="faculty-item">
                  <div className="faculty-icon">
                    {faculty.name.charAt(0)}
                  </div>
                  <div className="faculty-info">
                    <div className="faculty-name">{faculty.name}</div>
                    <div className="faculty-role">{faculty.role}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsFacultyModalOpen(false)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Replace the Chat Modal with the new ChatModal component */}
      {selectedGroup && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChat}
          groupId={selectedGroup._id}
          groupType={selectedGroupType}
          group={selectedGroup}
        />
      )}
    </div>
  );
};

export default StudentClasses;
