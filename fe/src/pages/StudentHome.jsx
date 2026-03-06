import { Navigate } from 'react-router';

// Student role has been removed — redirect to main dashboard
export default function StudentHome() {
  return <Navigate to="/" replace />;
}
