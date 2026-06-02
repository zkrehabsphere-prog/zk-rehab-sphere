import React, { useState, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const REQUIRED_PROFILE_FIELDS = ['name', 'age', 'bloodGroup', 'dob', 'phone'];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    dob: '',
    phone: '',
    socialLinks: {
      linkedIn: '',
      instagram: '',
      facebook: '',
      website: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || '',
      age: user.age || '',
      bloodGroup: user.bloodGroup || '',
      dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : '',
      phone: user.phone || '',
      socialLinks: {
        linkedIn: user.socialLinks?.linkedIn || '',
        instagram: user.socialLinks?.instagram || '',
        facebook: user.socialLinks?.facebook || '',
        website: user.socialLinks?.website || '',
        youtube: user.socialLinks?.youtube || ''
      }
    });

    setPhotoPreview(user.photo || '');
    setPhotoFile(null);
    setRemovePhoto(false);
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setRemovePhoto(false);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setPhotoFile(null);
    setRemovePhoto(true);
  };

  const calculateCompletionPercentage = (values) => {
    const filled = REQUIRED_PROFILE_FIELDS.filter((key) => Boolean(values[key]?.toString().trim()));
    return Math.round((filled.length / REQUIRED_PROFILE_FIELDS.length) * 100);
  };

  const missingItems = (values) => {
    return REQUIRED_PROFILE_FIELDS.filter((key) => !values[key]?.toString().trim()).map((key) => {
      return `Add your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name || '');
      formData.append('age', form.age || '');
      formData.append('bloodGroup', form.bloodGroup || '');
      formData.append('dob', form.dob || '');
      formData.append('phone', form.phone || '');
      formData.append('socialLinks', JSON.stringify(form.socialLinks));
      if (photoFile) {
        formData.append('photo', photoFile);
      } else if (removePhoto) {
        formData.append('photo', '');
      }

      await updateProfile(formData);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <SEO title="My Profile — ZK Rehab Sphere" />

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
          <div className="relative h-52 bg-gradient-to-r from-primary to-primary-dark" />
          <div className="px-6 pb-8 pt-4 sm:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative -mt-16 h-32 w-32 overflow-hidden rounded-[1.5rem] border-4 border-white bg-slate-100 shadow-xl">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={user?.name || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-5xl font-black text-slate-700">
                      {user?.name?.trim()?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <label className="absolute right-2 bottom-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-white text-slate-900 shadow shadow-slate-300 transition hover:bg-slate-100">
                    <Camera size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute left-2 bottom-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-red-600 shadow shadow-slate-300 transition hover:bg-slate-100"
                      aria-label="Remove profile picture"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">My Profile</p>
                  <h1 className="mt-2 text-3xl font-black text-slate-900">{user?.name || 'Your Name'}</h1>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                  <p className="text-slate-400">Profile strength</p>
                  <p className="mt-2 text-xl font-black text-slate-900">{calculateCompletionPercentage(form)}%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                  <p className="text-slate-400">Last login</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'No login data'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form id="profile-form" onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Personal details</h2>
                  <p className="mt-1 text-sm text-slate-500">Keep your patient profile simple and accurate.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Blood group"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
                <input
                  type="date"
                  placeholder="Date of birth"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-3xl border border-slate-200 bg-slate-200 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Social links</h2>
                  <p className="mt-1 text-sm text-slate-500">Optional social URLs for easier contact.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {Object.entries(form.socialLinks).map(([key, value]) => (
                  <input
                    key={key}
                    type="url"
                    placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                    value={value}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Profile status</h2>
              <p className="mt-1 text-sm text-slate-500">Complete the required fields for a better patient record.</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                  <p className="text-slate-400">Completion</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{calculateCompletionPercentage(form)}%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                  {missingItems(form).length > 0 ? (
                    <ul className="space-y-2">
                      {missingItems(form).map((item) => (
                        <li key={item} className="rounded-3xl border border-slate-200 bg-white px-4 py-3">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">All required fields are complete.</p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Save your profile</h2>
              <p className="mt-1 text-sm text-slate-500">Updates save to your account immediately.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {success && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
              <button
                type="submit"
                form="profile-form"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.24em] text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
