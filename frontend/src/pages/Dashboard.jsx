import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <AdminDashboard />;
}