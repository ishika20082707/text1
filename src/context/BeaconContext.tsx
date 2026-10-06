import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Application,
  User,
  getStoredCourses,
  saveStoredCourses,
  getStoredApplications,
  saveStoredApplications,
  getActiveUser,
  setActiveUser
} from '../data/mockData';

interface BeaconContextType {
  courses: Course[];
  applications: Application[];
  currentUser: User | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  login: (email: string, role: 'admin' | 'student', fullName: string) => void;
  logout: () => void;
  submitApplication: (app: Application) => void;
  saveApplicationDraft: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status'], remarks: string) => void;
  addCourse: (course: Course) => boolean;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
}

const BeaconContext = createContext<BeaconContextType | undefined>(undefined);

export const BeaconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load initial data
  useEffect(() => {
    setCourses(getStoredCourses());
    setApplications(getStoredApplications());
    setCurrentUser(getActiveUser());
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = (email: string, role: 'admin' | 'student', fullName: string) => {
    const user: User = { email, role, fullName };
    setCurrentUser(user);
    setActiveUser(user);
    showToast(`Welcome back, ${fullName}! Successfully logged in as ${role === 'admin' ? 'Administrator' : 'Student'}.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveUser(null);
    showToast('Successfully logged out.', 'info');
  };

  const submitApplication = (app: Application) => {
    const updatedApps = [...applications];
    const index = updatedApps.findIndex((a) => a.id === app.id || (a.studentId === app.studentId && a.status === 'Draft'));

    const finalApp: Application = {
      ...app,
      id: app.id && app.id.startsWith('APP-') ? app.id : `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    if (index > -1) {
      updatedApps[index] = finalApp;
    } else {
      updatedApps.push(finalApp);
    }

    setApplications(updatedApps);
    saveStoredApplications(updatedApps);
    showToast('Your admission application has been submitted successfully!', 'success');
  };

  const saveApplicationDraft = (app: Application) => {
    const updatedApps = [...applications];
    const index = updatedApps.findIndex((a) => a.studentId === app.studentId && a.status === 'Draft');

    const draftApp: Application = {
      ...app,
      id: app.id || `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Draft',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    if (index > -1) {
      updatedApps[index] = draftApp;
    } else {
      updatedApps.push(draftApp);
    }

    setApplications(updatedApps);
    saveStoredApplications(updatedApps);
    showToast('Draft saved successfully. You can complete it later.', 'success');
  };

  const updateApplicationStatus = (id: string, status: Application['status'], remarks: string) => {
    const updatedApps = applications.map((app) => {
      if (app.id === id) {
        return { ...app, status, remarks };
      }
      return app;
    });
    setApplications(updatedApps);
    saveStoredApplications(updatedApps);
    showToast(`Application ${id} updated to status: ${status}`, 'success');
  };

  const addCourse = (course: Course): boolean => {
    // Validate uniqueness of ID
    if (courses.some((c) => c.id.toLowerCase() === course.id.toLowerCase())) {
      showToast(`A course with ID "${course.id}" already exists.`, 'error');
      return false;
    }
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);
    showToast(`Course "${course.name}" added successfully.`, 'success');
    return true;
  };

  const updateCourse = (course: Course) => {
    const updatedCourses = courses.map((c) => (c.id === course.id ? course : c));
    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);
    showToast(`Course "${course.name}" updated successfully.`, 'success');
  };

  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find((c) => c.id === id);
    const updatedCourses = courses.filter((c) => c.id !== id);
    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);
    showToast(`Course "${courseToDelete?.name || id}" deleted successfully.`, 'success');
  };

  return (
    <BeaconContext.Provider
      value={{
        courses,
        applications,
        currentUser,
        toast,
        showToast,
        login,
        logout,
        submitApplication,
        saveApplicationDraft,
        updateApplicationStatus,
        addCourse,
        updateCourse,
        deleteCourse
      }}
    >
      {children}
    </BeaconContext.Provider>
  );
};

export const useBeacon = () => {
  const context = useContext(BeaconContext);
  if (!context) {
    throw new Error('useBeacon must be used within a BeaconProvider');
  }
  return context;
};
