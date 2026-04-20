import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowRight, CheckCircle } from 'lucide-react';
import Logo from './Logo';
import { newsletterAPI } from '../api/axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    try {
      const res = await newsletterAPI.subscribe(email);
      setSubStatus('success');
      setSubMsg(res.data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      setSubStatus('error');
      setSubMsg(err.message || 'Already subscribed or invalid email.');
    }
  };

  return (
    <footer className="bg-primary-dark text-white pt-16 pb-8 border-t border-primary-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
               <Logo light={true} />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering recovery through advanced diagnostics, personalized therapy, and compassionate care. Your health is our mission.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/share/18UmYRQRDr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors text-white/70 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/zkrehabsphere?igsh=MXU1c3Myazl1N3dwdg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors text-white/70 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/zk-rehab-sphere/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors text-white/70 hover:text-white">
                <Linkedin size={18} />
              </a>
              <a href="https://youtube.com/@zkrehabsphere?si=hDAXPlvQHl5oMzuN" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors text-white/70 hover:text-white">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Services', 'Meet Experts', 'Resources', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} // specific logic might be needed for 'meet experts' -> 'experts'
                    className="text-slate-300 hover:text-secondary hover:translate-x-1 transition-all inline-flex items-center gap-2 text-sm"
                  >
                     <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 transition-all" /> 
                     {item === 'Meet Experts' ? 'Experts' : item}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-secondary hover:translate-x-1 transition-all inline-flex items-center gap-2 text-sm">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-slate-300 text-sm">
                <MapPin size={20} className="text-secondary shrink-0 mt-1" />
                <span>Chandigarh Tricity Region<br/>Chandigarh | Mohali | Kharar</span>
              </li>
              <li className="flex items-center gap-4 text-slate-300 text-sm">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>+91 7340820883</span>
              </li>
              <li className="flex items-center gap-4 text-slate-300 text-sm">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>zkrehabsphere@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Stay Connected</h4>
            <p className="text-slate-300 text-sm mb-4">Receive rehabilitation insights, clinical articles, and educational updates from ZK Rehab Sphere.</p>
            {subStatus === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl p-3">
                <CheckCircle size={16} />
                <p className="text-sm">{subMsg}</p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-slate-500"
                />
                {subStatus === 'error' && <p className="text-red-400 text-xs">{subMsg}</p>}
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {subStatus === 'loading' ? 'Subscribing...' : 'Get Updates'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center bg-primary-dark">
            <p className="text-slate-400 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ZK Rehab Sphere. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
