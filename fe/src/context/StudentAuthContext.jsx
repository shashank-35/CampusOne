import { createContext, useContext, useState } from 'react';
import studentPortalService from '@/services/studentPortalService';

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem('student_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const res = await studentPortalService.login({ email, password });
    const { user, token } = res.data.data;

    if (user.role !== 'student') {
      throw new Error('This portal is for students only. Please use the admin login.');
    }

    localStorage.setItem('student_token', token);
    localStorage.setItem('student_user', JSON.stringify(user));
    setStudent(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    setStudent(null);
  };

  const updateStudentData = (data) => {
    const updated = { ...student, ...data };
    localStorage.setItem('student_user', JSON.stringify(updated));
    setStudent(updated);
  };

  return (
    <StudentAuthContext.Provider
      value={{ student, login, logout, updateStudentData, isAuthenticated: !!student }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error('useStudentAuth must be used within StudentAuthProvider');
  return ctx;
}
