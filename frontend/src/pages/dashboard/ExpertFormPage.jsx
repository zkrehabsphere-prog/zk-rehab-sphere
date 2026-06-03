import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { expertsAPI, usersAPI } from '../../api/axios';
import SEO from '../../components/SEO';

const ExpertFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    role: '',
    degree: '',
    experience: '',
    bio: '',
    email: '',
    phone: '',
    order: 0,
    linkedUserId: '',
    isActive: true,
    specializations: '',
    socialLinks: { linkedin: '', instagram: '' }
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
    if (isEdit) fetchExpert();
  }, [id]);

  const fetchUsers = async () => {
    try {
      const res = await usersAPI.getAll({ role: 'expert', limit: 100 });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchExpert = async () => {
    try {
      const res = await expertsAPI.getAllAdmin(); // Get all to find even inactive
      const expert = res.data.experts.find(e => e._id === id);
      if (expert) {
        setForm({
          name: expert.name,
          role: expert.role,
          degree: expert.degree,
          experience: expert.experience,
          bio: expert.bio,
          email: expert.email || '',
          phone: expert.phone || '',
          order: expert.order || 0,
          linkedUserId: expert.linkedUserId?._id || expert.linkedUserId || '',
          isActive: expert.isActive,
          specializations: expert.specializations?.join(', ') || '',
          socialLinks: expert.socialLinks || { linkedin: '', instagram: '' }
        });
        if (expert.image) {
          setImagePreview(expert.image);
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to fetch expert details.' });
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        ...form,
        specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
        image: imageBase64 || form.image // Send Base64 if changed, else keep old
      };

      if (isEdit) {
        await expertsAPI.update(id, payload);
        setMsg({ type: 'success', text: 'Expert updated successfully!' });
      } else {
        await expertsAPI.create(payload);
        setMsg({ type: 'success', text: 'Expert created successfully!' });
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <SEO title={`${isEdit ? 'Edit' : 'Add'} Expert — ZK Rehab Sphere`} />
      
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-semibold"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-primary px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Expert Profile' : 'Add New Expert'}</h1>
            <p className="text-white/80 text-sm">Fill in the professional details for the expert profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {msg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="font-semibold text-sm">{msg.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Image Upload */}
              <div className="md:col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors relative group">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview.startsWith('data') ? imagePreview : (imagePreview.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '')}${imagePreview}` : imagePreview)} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                    <button 
                      type="button" 
                      onClick={() => { setImagePreview(null); setImageBase64(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Upload Doctor Photo</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB (Saved in DB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                <input 
                  required
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Dr. Zeeshan Khan"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Role / Title *</label>
                <input 
                  required
                  type="text" 
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Senior Physiotherapist"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Degrees *</label>
                <input 
                  required
                  type="text" 
                  value={form.degree}
                  onChange={e => setForm({...form, degree: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. BPT, MPT (Sports)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Experience *</label>
                <input 
                  required
                  type="text" 
                  value={form.experience}
                  onChange={e => setForm({...form, experience: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. 10+ Years Experience"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="doctor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
                <input 
                  type="text" 
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Specializations (comma separated)</label>
                <input 
                  type="text" 
                  value={form.specializations}
                  onChange={e => setForm({...form, specializations: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Sports Injury, Manual Therapy, Neuro Rehab"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Biography *</label>
                <textarea 
                  required
                  value={form.bio}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[150px]"
                  placeholder="Describe the expert's background, expertise, and approach..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Display Order</label>
                <input 
                  type="number" 
                  value={form.order}
                  onChange={e => setForm({...form, order: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Link to User Account</label>
                <select
                  value={form.linkedUserId}
                  onChange={e => setForm({...form, linkedUserId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">None</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm({...form, isActive: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Active Profile (Visible on Website)</label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Save size={18} /> {loading ? 'Saving...' : (isEdit ? 'Update Expert' : 'Save Expert')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertFormPage;
