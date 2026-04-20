import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Shield, Activity, Users, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const LoginPage = () => {
  const { isAuthenticated, isLoading, login, getDashboardPath, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const error = searchParams.get('error');
  const sessionExpired = searchParams.get('session') === 'expired';
  const from = location.state?.from;

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from || getDashboardPath(), { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from, getDashboardPath]);

  const errorMessages = {
    oauth_failed: 'Google sign-in failed. Please try again.',
    callback_failed: 'Authentication error. Please try again.',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-16">
      <SEO title="Sign In — ZK Rehab Sphere" description="Sign in to access your ZK Rehab Sphere account." />

      {/* Background grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo + Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl mb-4">
              <Activity className="text-accent" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome to ZK Rehab Sphere</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to access your account</p>
          </div>

          {/* Error / Session expired messages */}
          {(error || sessionExpired) && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">
                {sessionExpired
                  ? 'Your session has expired. Please sign in again.'
                  : errorMessages[error] || 'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          {/* Return URL notice */}
          {from && !sessionExpired && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6 text-center">
              <p className="text-blue-300 text-xs">Sign in to continue to your destination.</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 group"
          >
            {/* Google SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
            <ArrowRight size={16} className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">Account types</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: 'Patient', desc: 'Book sessions, track recovery', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
              { icon: Activity, label: 'Doctor', desc: 'Manage appointments', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
              { icon: Shield, label: 'Admin', desc: 'Full platform control', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
            ].map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
                <Icon size={20} className={`${color} mx-auto mb-1`} />
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-slate-500 text-[10px] leading-tight mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-500 text-xs mt-6">
            By signing in, you agree to receive updates from ZK Rehab Sphere.
            <br />Roles are assigned by the platform administrator.
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2">
            ← Back to ZK Rehab Sphere
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
