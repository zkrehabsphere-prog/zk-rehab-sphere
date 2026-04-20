import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Stethoscope, BookOpen, Users, ArrowRight, GraduationCap } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';

import SEO from '../components/SEO';
import heroImg from '../assets/zk-reception.png';
import expertMehul from '../assets/expert-mehul.jpeg';
import expertMani from '../assets/expert-mani.jpeg';
import expertNuman from '../assets/expert-numan.jpeg';

const Home = () => {
  return (
    <div className="w-full">
      <SEO 
        title="ZK Rehab Sphere - Home Visit Physiotherapy" 
        description="An evidence-based physiotherapy and rehabilitation platform delivering trusted home visit services in the Chandigarh Tricity Region." 
      />
      {/* SECTION 1: HERO */}
      <section className="relative pt-0 pb-16 lg:pt-4 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left fade-in-up">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-50 via-teal-50 to-blue-50 text-secondary-dark font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-md border border-blue-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 cursor-default animate-fade-in-down">
              Evidence-Based Physiotherapy & Rehabilitation Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6 tracking-tight group cursor-default">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] animate-gradient inline-block hover:scale-105 transition-transform duration-300 drop-shadow-sm pb-1 mt-1">
                ZK Rehab Sphere
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-100">
              ZK Rehab Sphere is a structured rehabilitation platform delivering professional home-visit physiotherapy services, clinical consultation, and evidence-oriented learning resources.
            </p>
            <p className="text-sm sm:text-md text-slate-500 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-150 font-medium">
              Serving Chandigarh Tricity Region | Chandigarh | Mohali | Kharar
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start animate-fade-in-up delay-200 mt-8">
              <a href="https://wa.me/917340820883" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-base font-semibold px-6 py-3.5 bg-none bg-[#25D366] text-white shadow-lg shadow-green-500/40 hover:shadow-green-500/60 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 border border-transparent hover:border-white/20 ring-4 ring-transparent hover:ring-green-500/20 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book Appointment <span className="text-xs opacity-90 hidden sm:inline">(+91 7340820883)</span>
                  </span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </Button>
              </a>
              <a href="mailto:zkrehabsphere@gmail.com" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto text-base font-semibold px-6 py-3.5 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 group">
                  Email Us
                </Button>
              </a>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-gray-500 text-sm font-medium">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div> Patients
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div> Students
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-500"></div> Professionals
               </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 animate-fade-in-down px-4 lg:px-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 transform hover:scale-[1.01] transition-transform duration-500 max-h-[300px] sm:max-h-[500px] lg:max-h-full w-full object-cover">
               <img src={heroImg} alt="Physiotherapy Rehabilitation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT IS ZK REHAB SPHERE? */}
      <section className="py-12 lg:py-20 bg-white relative">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="lg:w-1/2 order-2 lg:order-1 relative group perspective-1000">
             <div className="absolute inset-0 bg-secondary/10 transform rotate-3 rounded-2xl z-0 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"></div>
             <div className="bg-slate-50 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-soft relative z-10 border border-slate-100 transition-all duration-500 group-hover:shadow-premium group-hover:-translate-y-2">
                 <div className="text-center p-8 transform transition-transform duration-500 group-hover:scale-110">
                    <div className="relative">
                        <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Activity size={64} className="relative mx-auto text-secondary mb-6 opacity-80 group-hover:text-primary transition-colors duration-300 animate-pulse-slow" />
                    </div>
                    <span className="text-slate-500 font-bold text-xl tracking-wider uppercase group-hover:text-primary transition-colors duration-300">Excellence in Care</span>
                 </div>
             </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <SectionTitle title="About ZK Rehab Sphere" subtitle="A Structured Platform for Modern Rehabilitation & Clinical Excellence." />
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-6 leading-tight">Redefining Rehabilitation with <br/><span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">Structure, Science & Integrity</span></h3>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg transform transition-all duration-500 hover:text-slate-800">
              ZK Rehab Sphere is an evolving rehabilitation platform designed to integrate structured home-based physiotherapy services, clinical guidance, and educational resources. 
              <br/><br/>
              Our focus is not only on recovery — but on building measurable outcomes, long-term functional independence, and professional growth within the rehabilitation ecosystem.
            </p>
            <Link to="/about">
              <Button size="lg" className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">About Us <ArrowRight size={20} className="ml-2 inline-block transition-transform group-hover:translate-x-1" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT WE OFFER */}
      <section className="py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionTitle title="What We Provide" subtitle="Comprehensive Rehabilitation & Specialized Therapeutic Services at Your Doorstep." className="mb-10 lg:mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <Card className="hover:-translate-y-2 group p-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Physiotherapy Care</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">Personalized home-based physiotherapy programs designed for stroke rehabilitation, paralysis, post-surgical recovery, joint replacement rehab, chronic back pain, cervical issues, sports injuries, and mobility restoration.</p>
              <Link to="/services" className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></Link>
            </Card>

            <Card className="hover:-translate-y-2 group p-6">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Clinical Guidance</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">Professional assessment and structured rehabilitation planning for complex neurological and orthopedic conditions, ensuring safe and goal-oriented recovery.</p>
               <Link to="/services" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></Link>
            </Card>

            <Card className="hover:-translate-y-2 group p-6">
               <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Rehab Education</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">Structured academic resources, clinical insights, and practical learning modules for physiotherapy students and professionals committed to continuous growth.</p>
               <Link to="/services" className="text-purple-600 font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></Link>
            </Card>

            <Card className="hover:-translate-y-2 group p-6">
               <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Academic & Clinical Support</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">Guided learning support, case-based discussions, practical insights, and career-focused mentorship for physiotherapy learners.</p>
               <Link to="/services" className="text-orange-600 font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></Link>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR EXPERTS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="Meet Our Experts" subtitle="Guided by experienced professionals." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-16">
            {[
              { name: "Dr. Mehul Kumar", role: "Senior Physiotherapist", img: expertMehul, desc: "Specialist in sports injuries and orthopedic rehabilitation with 3+ years of experience. BPT.", position: "object-top" },
              { name: "Dr. Mani Bhusan PT", role: "Physiotherapist", img: expertMani, desc: "Expert in neurological rehabilitation and patient care management with 2+ years of experience. BPT.", position: "object-top" },
              { name: "Dr.Mohammad Numan PT", role: "Physiotherapist", img: expertNuman, desc: "Dedicated physiotherapist with experience in patient care and rehabilitation. BPT.", position: "object-top" },
            ].slice(0, 3).map((expert, index) => (
              <Card key={index} className="text-center group p-0 overflow-hidden border-none hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={expert.img} alt={expert.name} className={`w-full h-full object-cover ${expert.position || 'object-top'} transform group-hover:scale-110 transition-transform duration-700`} />
                  </div>
                  <div className="p-8">
                      <h3 className="text-xl font-bold mb-1 text-primary-dark group-hover:text-primary transition-colors">{expert.name}</h3>
                      <p className="text-secondary font-medium mb-4 uppercase text-xs tracking-wider">{expert.role}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{expert.desc}</p>
                  </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/experts">
              <Button variant="outline-primary" className="px-8">View All Experts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: RESOURCES PREVIEW */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
         
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Knowledge Hub</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Resources Library</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Access our curated collection of articles, guides, and clinical notes.</p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
             <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400">
                    <Activity size={20} />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Latest Blog Posts</h4>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform"/> Understanding Chronic Pain
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform"/> 5 Daily Stretches
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform"/> Nutrition for Recovery
                  </li>
                </ul>
             </div>

             <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 text-green-400">
                    <BookOpen size={20} />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">PDF Books & Guides</h4>
                <ul className="space-y-4 text-slate-300">
                   <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform"/> Anatomy 101
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform"/> Rehab Procedures Manual
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-green-500 group-hover:translate-x-1 transition-transform"/> Patient Care Guide
                  </li>
                </ul>
             </div>

             <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-purple-400">
                    <GraduationCap size={20} />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Clinical Notes</h4>
                <ul className="space-y-4 text-slate-300">
                   <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform"/> Musculoskeletal Notes
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform"/> Neurology Basics
                  </li>
                  <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                      <ArrowRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform"/> Case Studies 2025
                  </li>
                </ul>
             </div>
          </div>
          
          <div className="text-center mt-16">
            <Link to="/resources">
              <Button className="bg-white text-primary hover:bg-blue-50 border-none px-10">Explore All Resources</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA STRIP */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-secondary-dark to-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 tracking-tight">Ready to Take the Next Step?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book an appointment with our experts today and start your journey towards a healthier life.
          </p>
          <Link to="/contact">
            <Button className="bg-white text-secondary-dark font-bold text-lg hover:bg-gray-50 px-12 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Contact Us Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
