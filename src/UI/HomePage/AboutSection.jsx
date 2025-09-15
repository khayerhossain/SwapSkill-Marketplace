"use client";
import Container from "@/components/shared/Container";
import Image from "next/image";
import CreativeSolutions from "../../assets/creative-solutions.jpg";
import SwapSkillCard from "../../assets/swapskill-card.jpg";
import SkillExchange from "../../assets/skill-exchange.jpg";

export default function AboutSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      </div>

      {/* Static Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <Container>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left side - Images */}
          <div className="relative order-2 lg:order-1">
            {/* Top Image */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-purple-500/90 to-blue-600/90 rounded-3xl p-6 transform rotate-3 shadow-2xl backdrop-blur-sm border border-white/20 hover:shadow-3xl transition-shadow duration-300">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-48 group">
                    <Image
                      src={CreativeSolutions}
                      alt="Creative Solutions"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold text-sm mb-1">Creative Solutions</h3>
                          <p className="text-white/80 text-xs">Innovation Hub</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics Card */}
            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-gray-100/50 z-20">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  30,000+
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  Happy Users
                </div>
              </div>
            </div>
            
            {/* Bottom Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-28">
                    <Image
                      src={SwapSkillCard}
                      alt="SwapSkill Platform"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-xs mb-1">SwapSkill</div>
                          <div className="text-white/70 text-xs">Platform</div>
                        </div>
                        <div className="w-8 h-8 bg-purple-600/90 backdrop-blur rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-28">
                    <Image
                      src={SkillExchange}
                      alt="Skill Exchange"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-xs mb-1">Exchange</div>
                          <div className="text-white/70 text-xs">Skills</div>
                        </div>
                        <div className="w-8 h-8 bg-blue-600/90 backdrop-blur rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">🔄</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rating Section */}
            <div className="mt-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100/50 inline-block">
                <div className="text-sm font-medium text-gray-700 mb-2">Best Ratings</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm"
                    >
                      <span className="text-white text-xs">★</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Decorative floating element */}
            <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg" />
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-7 w-full order-1 lg:order-2">
            <div className="text-purple-600 font-semibold text-sm tracking-wider uppercase">
              A BIT
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-5xl font-bold leading-tight text-gray-900">
              About{" "}
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              We are a passionate team of innovators dedicated to creating a revolutionary platform where{" "}
              <span className="font-semibold text-purple-600">
                skills meet opportunity
              </span>. 
              Our journey began with a simple belief that everyone has valuable talents worth sharing.
            </p>
            
            <p className="text-lg text-gray-500 max-w-lg">
              Join thousands of learners and professionals who are transforming their expertise into meaningful connections and{" "}
              <span className="font-semibold text-green-600">rewarding opportunities</span>.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Explore More
                </span>
              </button>

              <button className="group w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 backdrop-blur-sm bg-white/70">
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <span>→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}