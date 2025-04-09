import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const FacultyAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Simulating API fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for classes
        const mockClasses = [
          { id: 'c1', name: 'CSE-A Year 2', department: 'Computer Science', students: 42 },
          { id: 'c2', name: 'CSE-B Year 2', department: 'Computer Science', students: 38 },
          { id: 'c3', name: 'IT-A Year 3', department: 'Information Technology', students: 35 }
        ];
        
        setClasses(mockClasses);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  // Fetch students when a class is selected
  useEffect(() => {
    if (!selectedClass) return;
    
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Simulating API fetch delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for students
        const mockStudents = Array(selectedClass.students).fill().map((_, index) => ({
          id: `s${index + 1}`,
          rollNo: `${selectedClass.id.split('-')[0]}${index + 1}`,
          name: `Student ${index + 1}`,
          email: `student${index + 1}@example.com`,
          attendanceRate: Math.floor(Math.random() * 30 + 70) // Random attendance rate between 70-100%
        }));
        
        setStudents(mockStudents);
        
        // Initialize attendance data
        const initialAttendance = {};
        mockStudents.forEach(student => {
          initialAttendance[student.id] = true; // Default to present
        });
        
        setAttendanceData(initialAttendance);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [selectedClass]);

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleAttendanceChange = (studentId, present) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: present
    }));
  };

  const handleSaveAttendance = () => {
    // Here you would normally save the attendance data to your backend
    alert(`Attendance saved for ${selectedClass.name} on ${selectedDate}`);
    console.log("Saving attendance:", { class: selectedClass, date: selectedDate, attendance: attendanceData });
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendanceData(allPresent);
  };

  const handleMarkAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendanceData(allAbsent);
  };

  if (loading && !selectedClass) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !selectedClass) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance for your classes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Class Selection Sidebar */}
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-1">
          <h2 className="font-semibold text-lg mb-4">Select Class</h2>
          <div className="space-y-2">
            {classes.map(classItem => (
              <button
                key={classItem.id}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  selectedClass?.id === classItem.id
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleClassSelect(classItem)}
              >
                <div className="font-medium">{classItem.name}</div>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{classItem.department}</span>
                  <span>{classItem.students} students</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-2">Reports</h3>
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left text-indigo-600 hover:text-indigo-800 px-2 py-1">
                  Daily Reports
                </button>
              </li>
              <li>
                <button className="w-full text-left text-indigo-600 hover:text-indigo-800 px-2 py-1">
                  Monthly Summary
                </button>
              </li>
              <li>
                <button className="w-full text-left text-indigo-600 hover:text-indigo-800 px-2 py-1">
                  Attendance Statistics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Attendance Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-3">
          {!selectedClass ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-12 md:w-12 lg:h-10 lg:w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-center">Please select a class to take attendance</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedClass.name}</h3>
                  <p className="text-gray-600">{selectedClass.department} • {selectedClass.students} students</p>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="date" className="text-gray-700">Date:</label>
                  <input 
                    type="date" 
                    id="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {Object.values(attendanceData).filter(present => present).length} present / {students.length} total
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={handleMarkAllPresent}
                        className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                      >
                        Mark All Present
                      </button>
                      <button 
                        onClick={handleMarkAllAbsent}
                        className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >
                        Mark All Absent
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map(student => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNo}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm text-gray-900 mr-2">{student.attendanceRate}%</div>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      student.attendanceRate >= 90 ? 'bg-green-500' : 
                                      student.attendanceRate >= 75 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`} 
                                    style={{ width: `${student.attendanceRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                  <input 
                                    type="radio" 
                                    name={`attendance-${student.id}`} 
                                    checked={attendanceData[student.id] === true}
                                    onChange={() => handleAttendanceChange(student.id, true)}
                                    className="form-radio h-4 w-4 text-green-600" 
                                  />
                                  <span className="ml-2 text-sm text-green-700">Present</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input 
                                    type="radio" 
                                    name={`attendance-${student.id}`} 
                                    checked={attendanceData[student.id] === false}
                                    onChange={() => handleAttendanceChange(student.id, false)}
                                    className="form-radio h-4 w-4 text-red-600" 
                                  />
                                  <span className="ml-2 text-sm text-red-700">Absent</span>
                                </label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleSaveAttendance}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save Attendance
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
