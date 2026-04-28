import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../api/authContext';
import { useNotificationStore } from '../store/NotificationStore';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FooterLogo from '../components/FooterLogo';
import '../styles/layout.css';

export default function DashboardLayout() {
  const { user, isAuthenticated, loading } = useAuth();
  const { startPolling, stopPolling } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      startPolling(user);
    }
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, user, startPolling, stopPolling]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
        <FooterLogo />
      </div>
    </div>
  );
}
