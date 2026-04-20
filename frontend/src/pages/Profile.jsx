import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, ChevronRight, Hash, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/axios';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    gender: '',
    age: '',
    photo: null
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || '',
        age: user.age || '',
        photo: null
      });
      setPreview(user.photo || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('gender', form.gender);
      formData.append('age', form.age);
      if (form.photo) formData.append('photo', form.photo);

      const res = await usersAPI.updateProfile(formData);
      setUser(res.data.user);
      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <SEO title="My Profile — ZK Rehab Sphere" />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary-dark relative" />
          
          <div className="px-8 pb-8 relative">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-6 inline-block">
              <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl">
                <img 
                  src={preview || '/placeholder-avatar.jpg'} 
                  alt={user?.name} 
                  className="w-full h-full rounded-[1.25rem] object-cover"
                />
              </div>
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-1 -right-1 p-2.5 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:bg-primary-dark transition-colors border-2 border-white"
              >
                <Camera size={18} />
                <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-800">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                    {user?.role} Account
                 </span>
                 <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Mail size={12} /> {user?.email}
                 </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Personal Details</h3>
                  
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      type="text" 
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-700 font-medium"
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-slate-700 font-medium appearance-none"
                        value={form.gender} 
                        onChange={e => setForm({...form, gender: e.target.value})}
                      >
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                    </div>

                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        placeholder="Age"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-slate-700 font-medium"
                        value={form.age} 
                        onChange={e => setForm({...form, age: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Contact & Location</h3>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Phone Number"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-slate-700 font-medium"
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})} 
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                    <textarea 
                      placeholder="Full Residential Address"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-slate-700 font-medium min-h-[110px] resize-none"
                      value={form.address} 
                      onChange={e => setForm({...form, address: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-semibold animate-shake">
                   ❌ {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-sm font-semibold animate-float">
                   {success}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                  <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
