import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, MessageSquare, BookOpen, Activity,
  UserCheck, Bell, Trash2, Eye, CheckCircle, XCircle,
  Clock, ChevronDown, Plus, Shield, Edit, BarChart2, Mail, RefreshCw, X
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { usersAPI, appointmentsAPI, contactAPI, expertsAPI, slotsAPI, newsletterAPI } from '../../api/axios';
import SEO from '../../components/SEO';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`${bg} rounded-2xl p-6 border border-white/50`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-600 text-sm font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
  </div>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[status] || 'bg-slate-100 text-slate-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Role Badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cfg = {
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-blue-100 text-blue-800',
    patient: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[role] || ''}`}>
      {role}
    </span>
  );
};

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'slots', label: 'Slots', icon: Clock },
  { id: 'experts', label: 'Doctors (Profiles)', icon: Activity },
  { id: 'users', label: 'Patients (Accounts)', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];


const AVAILABLE_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM'
];

// ─── Add Slot Form ─────────────────────────────────────────────────────────────
const AddSlotForm = ({ doctors, onCreated }) => {
  const [form, setForm] = useState({ doctorId: '', date: '', times: [] });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const toggleTime = (time) => {
    setForm(prev => {
      const times = prev.times.includes(time) 
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time];
      return { ...prev, times };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.times.length === 0) {
      setMsg('❌ Please select at least one time slot.');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setLoading(true);
    try {
      await slotsAPI.create({ doctorId: form.doctorId, date: form.date, times: form.times });
      setMsg(`✅ Slots created!`);
      setForm({ doctorId: '', date: '', times: [] });
      if (onCreated) onCreated();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setMsg(''), 3000);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} /> Add Slots</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Doctor</label>
          <select
            required
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-2">Select Times</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TIMES.map(time => {
            const isSelected = form.times.includes(time);
            
            // Check if time is in the past for today
            let isPast = false;
            if (form.date === new Date().toISOString().split('T')[0]) {
              const [hStr, mStr] = time.split(' ')[0].split(':');
              const mod = time.split(' ')[1];
              let h = parseInt(hStr);
              if (mod === 'PM' && h < 12) h += 12;
              if (mod === 'AM' && h === 12) h = 0;
              const slotTime = new Date();
              slotTime.setHours(h, parseInt(mStr), 0, 0);
              isPast = slotTime < new Date();
            }

            if (isPast) return null;

            return (
              <button
                type="button"
                key={time}
                onClick={() => toggleTime(time)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-primary text-white border-primary shadow-sm scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {time}
              </button>
            );
          })}

        </div>
      </div>
      
      {msg && <p className={`mt-3 text-sm font-semibold ${msg.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
      
      <button type="submit" disabled={loading} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Slots'}
      </button>
    </form>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
// ─── Edit Appointment Modal ───────────────────────────────────────────────────
const EditAppointmentModal = ({ appointment, isOpen, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    patientAddress: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setForm({
        patientName: appointment.patientName || '',
        patientAge: appointment.patientAge || '',
        patientPhone: appointment.patientPhone || '',
        patientAddress: appointment.patientAddress || '',
        purpose: appointment.purpose || '',
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentsAPI.update(appointment._id, form);
      onUpdated();
      onClose();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Appointment</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Patient Name</label>
            <input required type="text" value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Age</label>
              <input required type="number" value={form.patientAge} onChange={e => setForm({...form, patientAge: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
              <input required type="text" value={form.patientPhone} onChange={e => setForm({...form, patientPhone: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
            <textarea required value={form.patientAddress} onChange={e => setForm({...form, patientAddress: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none min-h-[80px]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Purpose / Condition</label>
            <textarea value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none min-h-[80px]" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [experts, setExperts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState(''); // Default to All users to avoid confusion



  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await usersAPI.getDashboardStats();
        setStats(res.data.stats);
      } else if (tab === 'appointments') {
        const res = await appointmentsAPI.getAll({ limit: 50 });
        setAppointments(res.data.appointments || []);
      } else if (tab === 'slots') {
        const [slotsRes, usersRes] = await Promise.all([slotsAPI.getAll(), usersAPI.getAll({ role: 'doctor', limit: 100 })]);
        setSlots(slotsRes.data.slots || []);
        setDoctors(usersRes.data.users || []);
      } else if (tab === 'experts') {
        // Fetch all users with role 'doctor' AND all expert profiles
        const [usersRes, expertsRes] = await Promise.all([
          usersAPI.getAll({ role: 'doctor', limit: 100 }),
          expertsAPI.getAllAdmin()
        ]);
        
        // Merge them: Each doctor user might have a profile
        const allDoctors = (usersRes.data.users || []).map(u => {
          const profile = (expertsRes.data.experts || []).find(e => e.linkedUserId?._id === u._id || e.linkedUserId === u._id);
          return { ...u, profile };
        });
        
        setExperts(allDoctors);

      } else if (tab === 'users') {
        const res = await usersAPI.getAll({ role: roleFilter, limit: 100 });
        setUsers(res.data.users || []);
      } else if (tab === 'messages') {

        const res = await contactAPI.getAll({ limit: 50 });
        setMessages(res.data.messages || []);
      } else if (tab === 'newsletter') {
        const res = await newsletterAPI.getAll();
        setSubscribers(res.data.subscribers || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeTab); }, [activeTab, roleFilter]);


  const handleRoleChange = async (userId, role) => {
    try {
      await usersAPI.updateRole(userId, role);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) { alert(err.message); }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await usersAPI.setActive(userId, newStatus);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('PERMANENTLY delete this user account? This cannot be undone.')) return;
    try {
      await usersAPI.delete(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) { alert(err.message); }
  };


  const handleAppointmentStatus = async (id, status) => {
    let cancelReason = '';
    if (status === 'cancelled') {
        cancelReason = prompt('Reason for cancellation (optional):') || 'Cancelled by Admin';
    }
    try {
      await appointmentsAPI.updateStatus(id, { status, cancelReason });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) { alert(err.message); }
  };

  const handleEditClick = (apt) => {
    setEditingAppointment(apt);
    setIsEditModalOpen(true);
  };

  const handleDeleteAppointment = async (id) => {

    if (!confirm('Are you sure you want to PERMANENTLY delete this appointment? This cannot be undone.')) return;
    try {
        await appointmentsAPI.delete(id);
        setAppointments(prev => prev.filter(a => a._id !== id));
        alert('Appointment deleted successfully.');
    } catch (err) { alert(err.message); }
  };


  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteExpert = async (id) => {
    if (!confirm('Delete this expert profile?')) return;
    try {
      await expertsAPI.delete(id);
      setExperts(prev => prev.filter(e => e._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteSubscriber = async (id) => {
    try {
      await newsletterAPI.delete(id);
      setSubscribers(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleToggleExpertActive = async (expert) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !expert.isActive);
      await expertsAPI.update(expert._id, formData);
      setExperts(prev => prev.map(e => e._id === expert._id ? { ...e, isActive: !expert.isActive } : e));
    } catch (err) { alert(err.message); }
  };


  const handleDeleteSlot = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await slotsAPI.delete(id);
      setSlots(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="Admin Dashboard — ZK Rehab Sphere" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Shield size={20} className="text-purple-600" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
          </div>
          <img src={user?.photo} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-slate-200" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 mb-6 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === id ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        )}

        {/* ── Overview ── */}
        {activeTab === 'overview' && !loading && stats && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" bg="bg-blue-50" />
              <StatCard icon={UserCheck} label="Patients" value={stats.totalPatients} color="bg-green-500" bg="bg-green-50" />
              <StatCard icon={Activity} label="Doctors" value={stats.totalDoctors} color="bg-purple-500" bg="bg-purple-50" />
              <StatCard icon={Calendar} label="Appointments" value={stats.totalAppointments} color="bg-orange-500" bg="bg-orange-50" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Clock} label="Pending" value={stats.pendingAppointments} color="bg-yellow-500" bg="bg-yellow-50" />
              <StatCard icon={MessageSquare} label="Unread Messages" value={stats.unreadMessages} color="bg-red-500" bg="bg-red-50" />
              <StatCard icon={Mail} label="Subscribers" value={stats.totalSubscribers} color="bg-teal-500" bg="bg-teal-50" />
              <StatCard icon={Bell} label="New This Week" value={stats.recentAppointments} color="bg-indigo-500" bg="bg-indigo-50" />
            </div>
          </div>
        )}

        {/* ── Appointments ── */}
        {activeTab === 'appointments' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">All Appointments ({appointments.length})</h2>
              <button onClick={() => fetchData('appointments')} className="text-slate-400 hover:text-primary"><RefreshCw size={16} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Patient', 'Doctor', 'Date & Time', 'Purpose', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{apt.patientName}</div>
                        <div className="text-slate-400 text-xs">{apt.patientPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{apt.doctor?.name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800">{apt.slotDate}</div>
                        <div className="text-slate-400 text-xs">{apt.slotTime}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{apt.purpose || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                           <select
                            value={apt.status}
                            onChange={(e) => handleAppointmentStatus(apt._id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                          >
                            {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button 
                            onClick={() => handleEditClick(apt)}
                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Appointment"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(apt._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p className="text-center text-slate-400 py-10">No appointments yet.</p>}
            </div>
          </div>
        )}

        {/* ── Slots ── */}
        {activeTab === 'slots' && !loading && (
          <div>
            <AddSlotForm doctors={doctors} onCreated={() => fetchData('slots')} />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">All Slots ({slots.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Doctor', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slots.map((slot) => (
                      <tr key={slot._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">{slot.doctor?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{slot.date}</td>
                        <td className="px-4 py-3">{slot.time}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {!slot.isBooked && (
                            <button onClick={() => handleDeleteSlot(slot._id)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {slots.length === 0 && <p className="text-center text-slate-400 py-10">No slots created yet. Add some above.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Experts ── */}
        {activeTab === 'experts' && !loading && (
          <div>
            <div className="mb-4 flex justify-end">
              <a href="/dashboard/admin/experts/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus size={16} /> Add Expert
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((doc) => {
                const expert = doc.profile;
                return (
                  <div key={doc._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={expert?.image?.startsWith('/uploads') ? `${API_BASE}${expert.image}` : expert?.image || doc.photo || '/placeholder.jpg'}
                        alt={doc.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
                        <p className="text-slate-500 text-xs">{expert ? expert.role : 'No profile set up'}</p>
                      </div>
                      <RoleBadge role={doc.role} />
                    </div>
                    
                    {expert ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleToggleExpertActive(expert)}
                          className={`flex-1 text-center py-1 rounded-lg text-xs font-semibold transition-colors ${expert.isActive !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {expert.isActive !== false ? 'Visible' : 'Hidden'}
                        </button>
                        <a href={`/dashboard/admin/experts/edit/${expert._id}`} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={14} />
                        </a>
                        <button onClick={() => handleDeleteExpert(expert._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <a 
                          href={`/dashboard/admin/experts/new?userId=${doc._id}&name=${encodeURIComponent(doc.name)}`}
                          className="block w-full text-center py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
                        >
                          Create Professional Profile
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {experts.length === 0 && <p className="text-center text-slate-400 py-10">No doctor accounts found. Create a user with the 'doctor' role first.</p>}

          </div>
        )}

        {/* ── Users (Patients) ── */}
        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Account Management ({users.length})</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Filter:</span>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
                >
                  <option value="patient">Patients Only</option>
                  <option value="doctor">Doctors Only</option>
                  <option value="admin">Admins Only</option>
                  <option value="">All Users</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={u.photo || '/placeholder.jpg'} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          <span className="font-medium text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                        >
                          {['patient', 'doctor', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive !== false ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleActive(u._id, u.isActive !== false)}
                            className={`p-1.5 rounded-lg transition-colors ${u.isActive !== false ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                            title={u.isActive !== false ? 'Block User' : 'Unblock User'}
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-slate-400 py-10">No users found with this filter.</p>}
            </div>
          </div>
        )}


        {/* ── Messages ── */}
        {activeTab === 'messages' && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Contact Messages ({messages.length})</h2>
              <span className="text-xs text-slate-500">{messages.filter(m => !m.isRead).length} unread</span>
            </div>
            {messages.map((msg) => (
              <div key={msg._id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${msg.isRead ? 'border-slate-200 opacity-75' : 'border-blue-200 ring-1 ring-blue-100'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-800">{msg.name}</span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-slate-500 text-xs mb-1">{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                    <p className="text-slate-700 text-sm">{msg.message}</p>
                    <p className="text-slate-400 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!msg.isRead && (
                      <button onClick={() => handleMarkRead(msg._id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Mark as read">
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && <div className="text-center text-slate-400 py-12 bg-white rounded-2xl border border-slate-200">No messages yet.</div>}
          </div>
        )}

        {/* ── Newsletter ── */}
        {activeTab === 'newsletter' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Newsletter Subscribers ({subscribers.length})</h2>
              <span className="text-sm text-green-600 font-semibold">{subscribers.filter(s => s.isActive).length} active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Email', 'Status', 'Subscribed', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-700">{sub.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {sub.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteSubscriber(sub._id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && <p className="text-center text-slate-400 py-10">No subscribers yet.</p>}
            </div>
          </div>
        )}
      </div>

      <EditAppointmentModal 
        isOpen={isEditModalOpen} 
        appointment={editingAppointment} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdated={() => fetchData('appointments')} 
      />
    </div>
  );
};


export default AdminDashboard;
