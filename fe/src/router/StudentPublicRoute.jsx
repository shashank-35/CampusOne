import { Navigate, Outlet } from 'react-router';
import { useStudentAuth } from '@/context/StudentAuthContext';

export default function StudentPublicRoute() {
  const { isAuthenticated } = useStudentAuth();
  return isAuthenticated ? <Navigate to="/student-dashboard" replace /> : <Outlet />;
}
