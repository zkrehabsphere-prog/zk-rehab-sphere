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
import ExpertDashboard from '../pages/dashboard/ExpertDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import Profile from '../pages/Profile';
import ExpertProfile from '../pages/ExpertProfile';
import ExpertFormPage from '../pages/dashboard/ExpertFormPage';
import Blog from '../pages/Blog';
import BlogPostPage from '../pages/BlogPostPage';
import BlogFormPage from '../pages/dashboard/BlogFormPage';
import { useAuth } from '../context/AuthContext';


// Dashboard redirect by role
const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const paths = { admin: '/dashboard/admin', expert: '/dashboard/expert', patient: '/dashboard/patient' };
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
      <Route path="/experts/:id" element={<ExpertProfile />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Profile Route (All Roles) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={['admin', 'expert', 'patient']}>
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
        path="/dashboard/admin/experts/new"
        element={
          <ProtectedRoute roles={['admin']}>
            <ExpertFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/experts/:id/edit"
        element={
          <ProtectedRoute roles={['admin']}>
            <ExpertFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/blogs/new"
        element={
          <ProtectedRoute roles={['admin']}>
            <BlogFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/blogs/:id/edit"
        element={
          <ProtectedRoute roles={['admin']}>
            <BlogFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/expert"
        element={
          <ProtectedRoute roles={['expert']}>
            <ExpertDashboard />
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
