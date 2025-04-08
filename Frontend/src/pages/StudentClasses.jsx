import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentClasses = () => {
  const { user } = useAuth();

  // Mock classes data
  const classes = [
    {
      id: 1,
      courseCode: 'CS101',
      courseTitle: 'Introduction to Computer Science',
      faculty: 'Dr. Alan Turing',
      schedule: 'Mon, Wed, Fri (10:00 AM - 11:30 AM)'
    },
    {
      id: 2,
      courseCode: 'MATH204',
      courseTitle: 'Linear Algebra',
      faculty: 'Dr. Katherine Johnson',
      schedule: 'Tue, Thu (9:00 AM - 11:00 AM)'
    },
    {
      id: 3,
      courseCode: 'PHY202',
      courseTitle: 'Modern Physics',
      faculty: 'Dr. Richard Feynman',
      schedule: 'Mon, Wed (2:00 PM - 3:30 PM)'
    },
    {
      id: 4,
      courseCode: 'ENG101',
      courseTitle: 'Technical Writing',
      faculty: 'Prof. Jane Smith',
      schedule: 'Fri (1:00 PM - 4:00 PM)'
    },
    {
      id: 5,
      courseCode: 'CS305',
      courseTitle: 'Database Systems',
      faculty: 'Dr. Edgar Codd',
      schedule: 'Tue, Thu (1:00 PM - 2:30 PM)'
    },
    {
      id: 6,
      courseCode: 'BIO101',
      courseTitle: 'Introduction to Biology',
      faculty: 'Dr. Rosalind Franklin',
      schedule: 'Wed, Fri (11:00 AM - 12:30 PM)'
    }
  ];

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Classes</h1>
        <p className="text-gray">Courses you are enrolled in for the current semester</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{classItem.courseCode}</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
              </div>
              <h3 className="text-lg mb-3">{classItem.courseTitle}</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <span className="mr-2">👨‍🏫</span>
                  <span><strong>Faculty:</strong> {classItem.faculty}</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🕒</span>
                  <span><strong>Schedule:</strong> {classItem.schedule}</span>
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="btn btn-primary text-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClasses;
