import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Experts from '../pages/Experts';
import Resources from '../pages/Resources';
import Contact from '../pages/Contact';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import DoctorDashboard from '../pages/dashboard/DoctorDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import Profile from '../pages/Profile';
import DoctorProfile from '../pages/DoctorProfile';
import { useAuth } from '../context/AuthContext';


// Dashboard redirect by role
const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const paths = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', patient: '/dashboard/patient' };
  return <Navigate to={paths[user.role] || '/'} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/experts/:id" element={<DoctorProfile />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Profile Route (All Roles) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={['admin', 'doctor', 'patient']}>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* Dashboard — redirect to role-specific */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Protected Role-Specific Dashboards */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/patient"
        element={
          <ProtectedRoute roles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-8xl font-black text-slate-200 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Page Not Found</h2>
            <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">Back to Home</a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
