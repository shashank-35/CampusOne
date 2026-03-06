import { Navigate, Outlet } from 'react-router';
import { useStudentAuth } from '@/context/StudentAuthContext';

export default function StudentPrivateRoute() {
  const { isAuthenticated } = useStudentAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/student-login" replace />;
}
