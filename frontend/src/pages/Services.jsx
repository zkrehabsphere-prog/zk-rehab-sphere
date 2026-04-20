import React from 'react';
import { Activity, Stethoscope, BookOpen, Users, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import service1 from '../assets/service-1.png';
import service2 from '../assets/service-2.png';
import service3 from '../assets/service-3.png';
import service4 from '../assets/service-4.png';

const Services = () => {

  return (
    <div className="w-full">
      <SEO 
        title="Our Services - ZK Rehab Sphere" 
        description="Comprehensive physiotherapy services including home care, clinical guidance, and educational resources." 
      />

      {/* HERO SECTION */}
      <section className="relative pt-4 pb-16 lg:pt-6 lg:pb-28 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
                HOME VISIT PHYSIOTHERAPY & REHABILITATION
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                Expert Home Visit Physiotherapy in <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Chandigarh Tricity</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ZK Rehab Sphere provides structured, evidence-based physiotherapy and rehabilitation services at home across Chandigarh, Mohali, & Kharar. We focus on neurological, orthopedic, post-operative and chronic pain recovery with personalized care plans.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                 <Button className="shadow-xl shadow-primary/20">
                    Book Appointment
                 </Button>
                 <Button variant="outline-primary" className="bg-white">
                    Explore Services
                 </Button>
              </div>
            </div>

            {/* Interactive Image Frame */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fade-in-down">
               <div className="relative w-full max-w-lg group perspective-1000">
                  {/* Backdrop Blob */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Main Image Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white transform transition-all duration-500 hover:rotate-y-3 hover:scale-[1.02] hover:shadow-primary/20 bg-white">
                     <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={service1} 
                          alt="Professional Rehabilitation" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                     </div>
                     
                     {/* Interactive Floating Element */}
                     <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Success Stories</p>
                              <div className="flex -space-x-2">
                                 <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">+5k</div>
                                 <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
                                 <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-bold text-slate-900">4.9<span className="text-sm text-slate-400">/5</span></p>
                              <div className="flex text-yellow-400 text-sm">★★★★★</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

       {/* SERVICES GRID */}
       <section className="py-20 bg-gray-50">
         <div className="container mx-auto px-4">
           <SectionTitle title="What We Provide" subtitle="Comprehensive Rehabilitation & Specialized Therapeutic Services at Your Doorstep." />
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
             
             {/* Service 1: Home Physiotherapy */}
             <Card className="flex flex-col md:flex-row overflow-hidden group hover:shadow-2xl border-none">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={service1} alt="Home Physiotherapy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Activity size={24} /></div>
                      <h3 className="text-2xl font-bold text-gray-900">Physiotherapy Care</h3>
                   </div>
                   <p className="text-gray-600 mb-6 leading-relaxed">Personalized home-based physiotherapy programs designed for stroke rehabilitation, paralysis, post-surgical recovery, joint replacement rehab, chronic back pain, cervical issues, sports injuries, and mobility restoration.</p>
                   <a href="#" className="font-bold flex items-center gap-2 hover:underline text-blue-600 mt-auto">
                      Learn More <ArrowRight size={18} />
                   </a>
                </div>
             </Card>

             {/* Service 2: Clinical Guidance */}
             <Card className="flex flex-col md:flex-row overflow-hidden group hover:shadow-2xl border-none">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={service2} alt="Clinical Guidance" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600"><Stethoscope size={24} /></div>
                      <h3 className="text-2xl font-bold text-gray-900">Clinical Guidance</h3>
                   </div>
                   <p className="text-gray-600 mb-6 leading-relaxed">Professional assessment and structured rehabilitation planning for complex neurological and orthopedic conditions, ensuring safe and goal-oriented recovery.</p>
                   <a href="#" className="font-bold flex items-center gap-2 hover:underline text-green-600 mt-auto">
                      Learn More <ArrowRight size={18} />
                   </a>
                </div>
             </Card>

             {/* Service 3: Rehab Education */}
             <Card className="flex flex-col md:flex-row overflow-hidden group hover:shadow-2xl border-none">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={service3} alt="Rehab Education" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><BookOpen size={24} /></div>
                      <h3 className="text-2xl font-bold text-gray-900">Rehab Education</h3>
                   </div>
                   <p className="text-gray-600 mb-6 leading-relaxed">Structured academic resources, clinical insights, and practical learning modules for physiotherapy students and professionals committed to continuous growth.</p>
                   <a href="#" className="font-bold flex items-center gap-2 hover:underline text-purple-600 mt-auto">
                      Learn More <ArrowRight size={18} />
                   </a>
                </div>
             </Card>

             {/* Service 4: Student Mentorship */}
             <Card className="flex flex-col md:flex-row overflow-hidden group hover:shadow-2xl border-none">
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={service4} alt="Student Mentorship" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Users size={24} /></div>
                      <h3 className="text-2xl font-bold text-gray-900">Academic & Clinical Support</h3>
                   </div>
                   <p className="text-gray-600 mb-6 leading-relaxed">Guided learning support, case-based discussions, practical insights, and career-focused mentorship for physiotherapy learners.</p>
                   <a href="#" className="font-bold flex items-center gap-2 hover:underline text-orange-600 mt-auto">
                      Learn More <ArrowRight size={18} />
                   </a>
                </div>
             </Card>

           </div>
         </div>
       </section>

       {/* CONDITIONS WE TREAT SECTION */}
       <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
             <SectionTitle title="Conditions We Treat" subtitle="Home Visit Services" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                   "Stroke Rehabilitation",
                   "Paralysis & Hemiplegia",
                   "Post-Operative Rehabilitation",
                   "Total Knee Replacement (TKR) Rehab",
                   "Total Hip Replacement (THR) Rehab",
                   "Cervical & Lumbar Spondylosis",
                   "Slip Disc / Sciatica",
                   "Frozen Shoulder",
                   "Osteoarthritis",
                   "Sports Injuries",
                   "Ligament Injuries (ACL, PCL)",
                   "Geriatric Mobility Issues",
                   "Balance & Fall Prevention",
                   "Parkinson’s Rehabilitation",
                   "Bell’s Palsy",
                   "Chronic Pain Management",
                   "Muscle Weakness & Deconditioning",
                   "Post-Fracture Rehabilitation",
                   "Cupping Therapy (Hijama)"
                ].map((condition, index) => (
                   <div key={index} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow group">
                      <div className="bg-green-100 p-2 rounded-full mr-3 group-hover:bg-green-200 transition-colors">
                         <CheckCircle2 size={18} className="text-green-600" />
                      </div>
                      <span className="font-medium text-slate-700">{condition}</span>
                   </div>
                ))}
             </div>
          </div>
       </section>
      
      {/* OPTIONAL CTA */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
         <div className="container mx-auto px-4">
             <h2 className="text-2xl font-bold mb-4">Need Expert Physiotherapy at Home?</h2>
             <p className="text-gray-600 mb-6">Book your home visit consultation today and begin your structured recovery journey with ZK Rehab Sphere.</p>
             <a href="/contact">
                <Button className="px-8 bg-gray-900 hover:bg-gray-800">Book Home Visit Now</Button>
             </a>
         </div>
      </section>

    </div>
  );
};

export default Services;
