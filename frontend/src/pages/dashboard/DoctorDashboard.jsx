import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, Phone, MapPin, FileText, Activity, RefreshCw, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointmentsAPI, slotsAPI, expertsAPI } from '../../api/axios';
import SEO from '../../components/SEO';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StatusBadge = ({ status }) => {
  const cfg = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  const icons = { pending: Clock, confirmed: CheckCircle, completed: CheckCircle, cancelled: XCircle };
  const Icon = icons[status] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg[status] || ''}`}>
      <Icon size={12} /> {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TABS = [
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'slots', label: 'My Slots', icon: Clock },
  { id: 'profile', label: 'My Profile', icon: User },
];

const AVAILABLE_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM'
];

const AddSlotForm = ({ user, onCreated }) => {
  const [form, setForm] = useState({ date: '', times: [] });
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
      await slotsAPI.create({ doctorId: user.id || user._id, date: form.date, times: form.times });
      setMsg(`✅ Slots created!`);
      setForm({ date: '', times: [] });
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
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} /> Add My Slots</h3>
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full md:w-1/3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
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

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  
  const [slots, setSlots] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [notesValues, setNotesValues] = useState({});

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '', role: '', degree: '', experience: '', bio: '', specializations: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileMsg, setProfileMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'appointments') {
        const params = filter !== 'all' ? { status: filter } : {};
        const res = await appointmentsAPI.getAll({ ...params, limit: 100 });
        setAppointments(res.data.appointments || []);
      } else if (activeTab === 'slots') {
        const res = await slotsAPI.getAll({ doctorId: user.id || user._id, limit: 100 });
        setSlots(res.data.slots || []);
      } else if (activeTab === 'profile') {
        try {
          const res = await expertsAPI.getMe();
          setExpertProfile(res.data.expert);
          const e = res.data.expert;
          setProfileForm({
            name: e.name || '',
            role: e.role || '',
            degree: e.degree || '',
            experience: e.experience || '',
            bio: e.bio || '',
            specializations: e.specializations?.join(', ') || ''
          });
        } catch (err) {
          if (err.status === 404) {
            setExpertProfile(null);
            setProfileForm(prev => ({ ...prev, name: user.name }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab, filter]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      const notes = notesValues[id] || '';
      await appointmentsAPI.updateStatus(id, { status, doctorNotes: notes });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status, doctorNotes: notes } : a));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await slotsAPI.delete(id);
      setSlots(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach(k => {
        if (k === 'specializations') {
          formData.append(k, JSON.stringify(profileForm[k].split(',').map(s => s.trim()).filter(Boolean)));
        } else {
          formData.append(k, profileForm[k]);
        }
      });
      if (profileImage) formData.append('image', profileImage);
      
      const res = await expertsAPI.updateMe(formData);
      setExpertProfile(res.data.expert);
      setProfileMsg('✅ Profile updated successfully! It is now visible on the website.');
    } catch (err) {
      setProfileMsg(`❌ ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.slotDate === todayStr);
  const upcomingAppointments = appointments.filter(a => a.slotDate > todayStr && a.status !== 'cancelled');

  const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="Doctor Dashboard — ZK Rehab Sphere" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-primary" /> Doctor Dashboard
            </h1>
            <p className="text-slate-500 text-sm">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <img src={user?.photo} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-slate-200" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 mb-6 overflow-x-auto w-max">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === id ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ── APPOINTMENTS TAB ── */}
        {activeTab === 'appointments' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Today's", value: todayAppointments.length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-5 border border-white`}>
                  <Icon size={20} className={`${color} mb-2`} />
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-slate-500 text-sm">{label}</p>
                </div>
              ))}
            </div>

            {todayAppointments.length > 0 && (
              <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-6 text-white">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar size={18} /> Today's Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {todayAppointments.map(apt => (
                    <div key={apt._id} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{apt.patientName}</span>
                        <span className="text-white/80 text-sm">{apt.slotTime}</span>
                      </div>
                      <p className="text-white/70 text-xs">{apt.purpose || 'No purpose specified'}</p>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4 overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
            ) : (
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User size={18} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{apt.patientName}</h3>
                            <p className="text-slate-500 text-xs">Age {apt.patientAge}</p>
                          </div>
                          <StatusBadge status={apt.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} className="text-slate-400 shrink-0" />
                            {apt.patientPhone}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="text-slate-400 shrink-0" />
                            {apt.slotDate} at {apt.slotTime}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate">{apt.patientAddress}</span>
                          </div>
                        </div>

                        {apt.purpose && (
                          <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                            <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
                            <span>{apt.purpose}</span>
                          </div>
                        )}

                        {/* Notes input */}
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <div className="mt-3">
                            <textarea
                              placeholder="Add clinical notes (optional)..."
                              value={notesValues[apt._id] !== undefined ? notesValues[apt._id] : (apt.doctorNotes || '')}
                              onChange={(e) => setNotesValues(prev => ({ ...prev, [apt._id]: e.target.value }))}
                              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary resize-none min-h-[60px]"
                            />
                          </div>
                        )}

                        {apt.doctorNotes && apt.status !== 'pending' && apt.status !== 'confirmed' && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                            <span className="font-semibold text-slate-500 text-xs block mb-1">Notes</span>
                            {apt.doctorNotes}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {(apt.status === 'pending' || apt.status === 'confirmed') && (
                        <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => handleStatus(apt._id, 'confirmed')}
                              disabled={updating === apt._id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle size={14} /> Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatus(apt._id, 'completed')}
                              disabled={updating === apt._id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle size={14} /> Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleStatus(apt._id, 'cancelled')}
                            disabled={updating === apt._id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 font-medium">No appointments found.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── MY SLOTS TAB ── */}
        {activeTab === 'slots' && (
          <>
            <AddSlotForm user={user} onCreated={fetchData} />
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">My Slots ({slots.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Date', 'Time', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {slots.map((slot) => (
                        <tr key={slot._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-700">{slot.date}</td>
                          <td className="px-4 py-3">{slot.time}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                              {slot.isBooked ? 'Booked' : 'Available'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {!slot.isBooked && (
                              <button onClick={() => handleDeleteSlot(slot._id)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {slots.length === 0 && <p className="text-center text-slate-400 py-10">You haven't created any slots yet. Add some above.</p>}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── MY PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Public Expert Profile</h2>
              {expertProfile?.isActive && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Visible on Website</span>}
            </div>
            
            <div className="p-6">
              {!expertProfile && !loading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-6 text-sm">
                  <strong>Welcome!</strong> Please fill out this form to generate your public Expert profile on the website so patients can read about you.
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit} className="max-w-2xl">
                <div className="mb-6 flex items-center gap-6">
                  {/* Photo Preview */}
                  <div className="shrink-0">
                    <img 
                      src={profileImage ? URL.createObjectURL(profileImage) : (expertProfile?.image ? `${API_BASE}${expertProfile.image}` : user?.photo || '/placeholder.jpg')}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Update Public Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setProfileImage(e.target.files[0])}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2">Square aspect ratio recommended.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Public Display Name</label>
                    <input required type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" placeholder="Dr. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Title / Role</label>
                    <input required type="text" value={profileForm.role} onChange={e => setProfileForm({...profileForm, role: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" placeholder="Senior Physiotherapist" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Degree / Qualifications</label>
                    <input required type="text" value={profileForm.degree} onChange={e => setProfileForm({...profileForm, degree: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" placeholder="BPT, MPT (Ortho)" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Experience</label>
                    <input required type="text" value={profileForm.experience} onChange={e => setProfileForm({...profileForm, experience: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" placeholder="5+ Years" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Specializations (comma-separated)</label>
                  <input type="text" value={profileForm.specializations} onChange={e => setProfileForm({...profileForm, specializations: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary" placeholder="Sports Injuries, Post-Op Care" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Biography</label>
                  <textarea required value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:border-primary" placeholder="Write a welcoming description about your approach and background..." />
                </div>

                {profileMsg && <div className="mb-4 text-sm font-semibold text-primary">{profileMsg}</div>}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" disabled={savingProfile} className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
