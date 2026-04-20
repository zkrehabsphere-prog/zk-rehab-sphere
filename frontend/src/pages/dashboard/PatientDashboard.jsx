import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Phone, MapPin, FileText, User, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentsAPI } from '../../api/axios';
import SEO from '../../components/SEO';

const StatusBadge = ({ status }) => {
  const cfg = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[status] || ''}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ phone: user?.phone || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentsAPI.getAll({ limit: 50 });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      setSaveMsg('✅ Profile updated!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('❌ Failed to update. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalBookings = appointments.length;
  const activeBookings = appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
  const completedBookings = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="My Dashboard — ZK Rehab Sphere" />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <img src={user?.photo} alt={user?.name} className="w-14 h-14 rounded-full border-2 border-white/30" />
          <div>
            <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-white/70 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: activeBookings, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Completed', value: completedBookings, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 sm:p-5 border border-white`}>
              <Icon size={18} className={`${color} mb-1`} />
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-slate-500 text-xs sm:text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Book Appointment CTA */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Need physiotherapy at home?</h3>
            <p className="text-slate-400 text-sm">Browse available slots and book your session.</p>
          </div>
          <Link
            to="/"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors hover:shadow-lg"
          >
            <Plus size={16} /> Book Now
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> My Appointments
            </h2>

            {loading ? (
              <div className="flex justify-center py-8"><div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No appointments yet.</p>
                <p className="text-slate-400 text-sm mt-1">Book your first session from the home page.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800">{apt.slotDate}</span>
                          <span className="text-slate-500 text-sm">at {apt.slotTime}</span>
                        </div>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                          <User size={13} className="text-primary" /> {apt.doctor?.name || 'Doctor'}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    {apt.purpose && (
                      <p className="text-slate-600 text-sm flex items-start gap-2">
                        <FileText size={13} className="text-slate-400 mt-0.5 shrink-0" />
                        {apt.purpose}
                      </p>
                    )}

                    {apt.patientAddress && (
                      <p className="text-slate-500 text-xs flex items-center gap-1 mt-2">
                        <MapPin size={12} /> {apt.patientAddress}
                      </p>
                    )}

                    {apt.doctorNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold mb-1">Doctor's Notes</p>
                        <p className="text-sm text-slate-700">{apt.doctorNotes}</p>
                      </div>
                    )}

                    {apt.status === 'cancelled' && apt.cancelReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                        Reason: {apt.cancelReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Sidebar */}
          <div>
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" /> My Profile
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-center mb-5">
                <img src={user?.photo} alt={user?.name} className="w-16 h-16 rounded-full border-2 border-primary/20 mx-auto mb-2 object-cover" />
                <p className="font-bold text-slate-800">{user?.name}</p>
                <p className="text-slate-500 text-xs">{user?.email}</p>
                <span className="inline-flex mt-1 px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Patient</span>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Address</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Your home address..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                {saveMsg && <p className="text-sm text-center">{saveMsg}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-4 mt-4">
              <h3 className="font-bold text-slate-700 text-sm mb-2">Quick Contact</h3>
              <a
                href="https://wa.me/917340820883"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 px-4 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <Activity size={16} /> WhatsApp Clinic
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
