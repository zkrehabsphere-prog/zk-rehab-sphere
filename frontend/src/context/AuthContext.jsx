import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to Firebase Auth state for background persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const res = await authAPI.verifyFirebase();
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Background auth sync failed:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      // 1. Trigger Firebase Popup
      await signInWithPopup(auth, googleProvider);
      
      // 2. Immediately force backend verification
      const res = await authAPI.verifyFirebase();
      const loggedInUser = res.data.user;
      
      setUser(loggedInUser);
      setIsAuthenticated(true);

      // 3. Force redirect to dashboard so the user feels the transition
      const paths = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', patient: '/dashboard/patient' };
      window.location.href = paths[loggedInUser.role] || '/dashboard/patient';

    } catch (err) {
      console.error("Login sequence failed:", err);
      alert("Login sequence failed: " + (err.message || 'Network Error. Is the backend running?'));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out of Firebase
      await authAPI.logout(); // Clear backend cookie session if still used
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    setUser(res.data.user);
    return res.data.user;
  };

  // Helpers
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';
  const hasRole = (...roles) => roles.includes(user?.role);

  const getDashboardPath = () => {
    if (!user) return '/login';
    const paths = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', patient: '/dashboard/patient' };
    return paths[user.role] || '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isDoctor,
        isPatient,
        hasRole,
        login,
        logout,
        updateProfile,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
