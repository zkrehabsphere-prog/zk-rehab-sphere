import React from 'react';
import { Heart, Target, Shield, GraduationCap, Users } from 'lucide-react';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import founderImg from '../assets/founder.jpeg';

import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="w-full">
      <SEO 
        title="About Us - ZK Rehab Sphere" 
        description="Learn about our mission, vision, and the expert team dedicated to your recovery." 
      />
      
      {/* HERO SECTION */}
      <section className="relative pt-4 pb-16 lg:pt-6 lg:pb-28 bg-primary overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Discover the vision behind ZK Rehab Sphere – a rehabilitation platform built on science, structured learning, and ethical clinical practice.
          </p>
        </div>
      </section>

      {/* SECTION 2: WHO WE ARE (Vision, Mission, Why) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             
             {/* Vision Card */}
             <Card className="px-6 py-10 h-full border-t-4 border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Target size={36} className="drop-shadow-sm" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To build a trusted rehabilitation platform that delivers evidence-based physiotherapy services while making structured clinical knowledge accessible to patients and professionals alike.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Our vision is to strengthen rehabilitation standards through science-driven care, ethical practice, and long-term impact.
                </p>
             </Card>

             {/* Mission Card */}
             <Card className="px-6 py-10 h-full border-t-4 border-green-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Users size={36} className="drop-shadow-sm" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide high-quality home visit physiotherapy services across the Chandigarh Tricity region while developing educational resources that support clinical clarity and professional growth.
                </p>
             </Card>

             {/* Purpose Card */}
             <Card className="px-6 py-10 h-full border-t-4 border-purple-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Heart size={36} className="drop-shadow-sm" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Why We Exist</h3>
                <p className="text-gray-600 leading-relaxed">
                  We exist to bridge the gap between theoretical knowledge and real-world practice by combining hands-on physiotherapy services with structured, practical learning resources.
                </p>
             </Card>

           </div>
        </div>
      </section>

      {/* SECTION 3: OUR PURPOSE */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Core Philosophy" subtitle=" The principles that guide our rehabilitation practice and learning ecosystem." />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Rehabilitation Care</h3>
              <p className="text-gray-600">
                Every treatment plan is structured around clinical assessment, individual goals, and functional recovery outcomes. We prioritize long-term improvement over short-term relief.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Structured Clinical Learning</h3>
              <p className="text-gray-600">
                We believe rehabilitation must be supported by continuous learning. Through articles, resources, and educational materials, we promote clinical clarity and practical understanding.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow border-t-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Ethical & Evidence-Based Practice</h3>
              <p className="text-gray-600">
                Integrity, transparency, and science-driven decision-making define our approach. Every recommendation is grounded in clinical reasoning and professional responsibility.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: FOUNDER SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary-dark rounded-3xl overflow-hidden shadow-2xl text-white">
             <div className="flex flex-col lg:flex-row">
                
                {/* Founder Image Placeholder */}
                <div className="md:w-1/3 lg:w-1/3 relative min-h-[300px] lg:min-h-full">
                    <img src={founderImg} alt="Sajid Khan - Founder" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent"></div>
                </div>

                {/* Founder Content */}
                <div className="md:w-2/3 lg:w-2/3 p-8 md:p-10 lg:p-16 flex flex-col justify-center">
                   <h2 className="text-3xl md:text-4xl font-bold mb-2">Sajid Khan</h2>
                   <p className="text-accent font-semibold uppercase tracking-wider mb-8">Founder, ZK Rehab Sphere <br/> Physiotherapy Professional</p>
                   
                   <div className="space-y-6 text-lg leading-relaxed text-blue-50">
                      <p>
                        "I founded ZK Rehab Sphere with a vision to build a rehabilitation platform grounded in science, structured clinical learning, and accessible home-based care."
                      </p>
                      <p>
                        The initiative combines home visit physiotherapy services across the Chandigarh Tricity region with educational resources, clinical insights, and knowledge-driven content aimed at strengthening rehabilitation standards. With a strong commitment to ethical practice and continuous learning, ZK Rehab Sphere is built as a long-term platform for both patient care and professional development.
                      </p>
                   </div>
                   
                   <div className="mt-10 pt-8 border-t border-primary-light flex items-center gap-4">
                      {/* Signature placeholder or simple text */}
                      <span className="font-serif italic text-2xl opacity-80">Sajid Khan</span>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
