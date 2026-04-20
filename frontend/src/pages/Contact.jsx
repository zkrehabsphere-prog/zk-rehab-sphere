import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import heroImg from '../assets/zk-reception.png';
import physioGym from '../assets/physio-gym.png';
import { contactAPI } from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await contactAPI.send(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send your message. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <SEO
        title="Contact Us - ZK Rehab Sphere"
        description="Get in touch with ZK Rehab Sphere for appointments, inquiries, and support."
      />

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-28 lg:pt-12 lg:pb-36 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/80 z-10 mix-blend-multiply" />
          <img src={heroImg} alt="Contact Us" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="absolute inset-0 z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-4 text-center relative z-20 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">Connect with ZK Rehab Sphere</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto drop-shadow-sm font-medium">
            Home Visit Physiotherapy | Clinical Guidance | Educational Resources
          </p>
          <p className="text-blue-50 mt-4 max-w-2xl mx-auto opacity-90">
            Reach out for appointments, professional collaborations, article contributions, or resource-related enquiries.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* LEFT COLUMN: CONTACT INFO */}
            <div className="lg:w-1/3 space-y-8">
              <SectionTitle
                title="Connect with ZK Rehab Sphere"
                subtitle="For appointments, professional enquiries, collaborations, and educational support."
                className="text-left"
              />
              <div className="space-y-6">
                <Card className="flex items-start gap-4 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Service Coverage</h4>
                    <p className="text-gray-600">Chandigarh Tricity Region</p>
                    <p className="text-gray-500 text-sm">Chandigarh | Mohali | Kharar</p>
                  </div>
                </Card>

                <Card className="flex items-start gap-4 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Email Enquiries</h4>
                    <p className="text-gray-600">zkrehabsphere@gmail.com</p>
                    <p className="text-gray-500 text-sm mt-1">Response within 24 hours</p>
                  </div>
                </Card>

                <Card className="flex items-start gap-4 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Call for Appointments</h4>
                    <p className="text-gray-600">+91 7340820883</p>
                    <p className="text-gray-500 text-sm mt-1">Available by prior appointment</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:w-2/3">
              <Card className="p-8 lg:p-10 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Request a Consultation or Enquiry</h3>

                {/* Success State */}
                {status === 'success' ? (
                  <div className="flex flex-col items-center text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h4>
                    <p className="text-slate-500 mb-6">Thank you for reaching out. We will get back to you within 24 hours.</p>
                    <Button onClick={() => setStatus('idle')} variant="outline-primary">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error banner */}
                    {status === 'error' && (
                      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="john@example.com" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number (Optional)</label>
                      <input type="tel" id="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="+91 98765 43210" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-semibold text-gray-700">Your Message</label>
                      <textarea id="message" rows="5" value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                        placeholder="How can we help you?" required />
                    </div>

                    <Button type="submit" disabled={status === 'loading'}
                      className="w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2 text-lg">
                      {status === 'loading' ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Presence Section */}
      <section className="h-[400px] w-full relative overflow-hidden">
        <img src={physioGym} alt="Physiotherapy Facility" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center text-white text-center p-4">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <MapPin size={48} className="mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-2">Our Presence</h3>
            <p className="text-lg font-medium">Chandigarh Tricity Region</p>
            <p className="text-sm opacity-80">Serving Chandigarh, Mohali, and Kharar with expert care.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
