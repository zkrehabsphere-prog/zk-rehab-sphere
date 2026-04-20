import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle, User, Phone, FileText, MapPin, LogIn, AlertCircle } from 'lucide-react';
import Button from './Button';
import { jsPDF } from 'jspdf';
import { slotsAPI, appointmentsAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, login } = useAuth();
  const [step, setStep] = useState('select-slot'); // 'select-slot' | 'details' | 'loading' | 'success' | 'error'
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    phone: user?.phone || '',
    address: user?.address || '',
    purpose: '',
  });

  // Fetch available slots when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSlots();
    }
    if (isOpen && user) {
      setFormData(prev => ({ ...prev, name: user.name || '', phone: user.phone || '', address: user.address || '' }));
    }
  }, [isOpen, isAuthenticated, user]);

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const res = await slotsAPI.getAvailable();
      const allSlots = res.data.slots || [];
      
      // Filter out slots that are in the past (especially for Today)
      const now = new Date();
      // Adjust to IST if needed, but client's local time is usually what users expect for "past"
      // However, for consistency with our IST backend, let's parse properly.
      
      const filtered = allSlots.filter(slot => {
        const [time, modifier] = slot.time.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        const slotDate = new Date(`${slot.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
        return slotDate > now;
      });

      setFreeSlots(filtered);
    } catch (err) {
      setError('Failed to load available slots. Please try again.');
    } finally {
      setSlotsLoading(false);
    }
  };


  if (!isOpen) return null;

  // If not logged in — show login prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"><X size={20} /></button>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={28} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign in to Book</h2>
          <p className="text-slate-500 mb-6">You need to be signed in to book an appointment. We use Google Sign-In to keep your records safe and secure.</p>
          <Button onClick={login} className="w-full justify-center gap-2 mb-3">
            Sign in with Google
          </Button>
          <button onClick={onClose} className="w-full text-slate-500 hover:text-slate-700 text-sm py-2 transition-colors">Maybe later</button>
        </div>
      </div>
    );
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const generatePDF = (apt, slot) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(15, 118, 110);
    doc.text('ZK Rehab Sphere', 20, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Appointment Confirmation', 20, 32);
    doc.setFontSize(11);
    const lines = [
      ['Patient Name', apt.patientName],
      ['Age', String(apt.patientAge)],
      ['Phone', apt.patientPhone],
      ['Address', apt.patientAddress],
      ['Doctor', slot.doctor?.name || 'ZK Rehab Expert'],
      ['Date', slot.date],
      ['Time', slot.time],
      ['Booking ID', apt._id],
    ];
    let y = 50;
    lines.forEach(([label, val]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(val, 65, y);
      y += 10;
    });
    if (apt.purpose) {
      y += 4;
      doc.text('Purpose/Condition:', 20, y); y += 8;
      const split = doc.splitTextToSize(apt.purpose, 170);
      doc.text(split, 20, y);
    }
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Thank you for choosing ZK Rehab Sphere. Our physiotherapist will visit you at the scheduled time.', 20, 270);
    doc.save(`ZK-Rehab-Appointment-${apt._id}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('loading');
    setError('');

    try {
      const res = await appointmentsAPI.book({
        slotId: selectedSlot._id,
        patientName: formData.name,
        patientAge: formData.age,
        patientPhone: formData.phone,
        patientAddress: formData.address,
        purpose: formData.purpose,
      });

      const apt = res.data.appointment;
      setAppointment(apt);
      generatePDF(apt, selectedSlot);
      setStep('success');

      // Also open WhatsApp with booking details
      const phoneNumber = '917340820883';
      const message = `*New Appointment Request*\n\n*Name:* ${formData.name}\n*Age:* ${formData.age}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}\n*Date:* ${selectedSlot.date}\n*Time:* ${selectedSlot.time}\n*Purpose:* ${formData.purpose}\n\n_Booking ID: ${apt._id}_`;
      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
      setStep('details');
    }
  };

  // Group slots by date
  const slotsByDate = freeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-primary" size={20} /> Book Appointment
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step: Select Slot */}
          {step === 'select-slot' && (
            <div>
              <p className="text-slate-600 mb-4 text-sm">Select a convenient time slot for your home visit.</p>
              {slotsLoading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : freeSlots.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                  <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500 font-medium">No available slots right now.</p>
                  <p className="text-slate-400 text-sm mt-1">Please call us directly at +91 7340820883</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(slotsByDate).map(([date, slots]) => (
                    <div key={date}>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Calendar size={12} /> {formatDate(date)}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map(slot => (
                          <button
                            key={slot._id}
                            onClick={() => handleSlotSelect(slot)}
                            className="flex flex-col items-center p-3 rounded-xl border border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <Clock size={14} className="text-slate-400 mb-1 group-hover:text-primary" />
                            <span className="text-sm font-bold text-slate-800 group-hover:text-primary">{slot.time}</span>
                            {slot.doctor && <span className="text-[10px] text-slate-400 mt-0.5 truncate w-full text-center">{slot.doctor.name.split(' ')[1]}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step: Details Form */}
          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected slot info */}
              <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 text-sm text-blue-800 border border-blue-100">
                <Clock size={16} />
                <span className="font-semibold">{formatDate(selectedSlot?.date)} at {selectedSlot?.time}</span>
                {selectedSlot?.doctor && <span className="text-blue-600">· {selectedSlot.doctor.name}</span>}
                <button type="button" onClick={() => setStep('select-slot')} className="ml-auto text-xs underline hover:text-blue-900">Change</button>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700"
                      placeholder="Your full name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                    <input type="number" required min="1" max="120" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700"
                      placeholder="Age" />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700"
                        placeholder="+91..." />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700 resize-none min-h-[60px]"
                      placeholder="House No, Street, City..." />
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Purpose / Condition</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                    <textarea value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700 resize-none min-h-[70px]"
                      placeholder="Reason for appointment (e.g. Back pain, Post-surgery)..." />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full justify-center gap-2">
                Confirm Appointment
              </Button>
            </form>
          )}

          {/* Step: Loading */}
          {step === 'loading' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Confirming your appointment...</p>
              <p className="text-slate-400 text-sm mt-1">Generating PDF & sending confirmations</p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Appointment Confirmed!</h3>
              <p className="text-slate-600 mb-2">
                Your appointment on <span className="font-semibold">{selectedSlot?.date} at {selectedSlot?.time}</span> is confirmed.
              </p>
              <p className="text-slate-500 text-sm mb-6">A PDF receipt has been downloaded. WhatsApp is opening with booking details.</p>
              <Button onClick={onClose} className="w-full justify-center">Done</Button>
            </div>
          )}
        </div>

        {step !== 'success' && step !== 'loading' && (
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center shrink-0">
            <p className="text-xs text-slate-400">Secure booking · PDF receipt included · WhatsApp confirmation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
