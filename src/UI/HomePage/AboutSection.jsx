"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import CreativeSolutions from "../../assets/creative-solutions.jpg";
import SwapSkillCard from "../../assets/swapskill-card.jpg";
import SkillExchange from "../../assets/skill-exchange.jpg";

const textVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  }),
};

const imageVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.25,
      duration: 1,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  }),
};

const floatingVariants = {
  animate: {
    y: [-8, 8, -8],
    rotate: [0, 3, 0, -3, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300/40 to-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.15, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-blue-300/40 to-green-300/40 rounded-full mix-blend-multiply filter blur-3xl"
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <Container>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left side - Enhanced Image Gallery */}
          <div className="relative">
            
            {/* Main Featured Card */}
            <motion.div
              custom={0}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative mb-8"
            >
              <motion.div
                variants={floatingVariants}
                animate="animate"
                whileHover={cardHoverVariants.hover}
                className="bg-gradient-to-br from-purple-500/90 to-blue-600/90 rounded-3xl p-6 transform rotate-2 shadow-2xl backdrop-blur-sm border border-white/20"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-56 group">
                    <Image
                      src={CreativeSolutions}
                      alt="Creative Solutions - Team collaboration and innovation"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    {/* Elegant overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">Creative Solutions</h3>
                          <p className="text-white/80 text-sm">Innovation & Collaboration</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          >
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Statistics Card - Enhanced */}
            <motion.div
              custom={1}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-100/50 z-20"
            >
              <div className="text-center">
                <motion.div 
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  30,000+
                </motion.div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <motion.span 
                    className="text-yellow-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⭐
                  </motion.span>
                  Happy Users
                </div>
                <div className="text-xs text-gray-400 mt-1">Globally Connected</div>
              </div>
            </motion.div>
            
            {/* Bottom Card Grid - Enhanced */}
            <motion.div
              custom={2}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              {/* SwapSkill Card */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1, y: -8 }}
                className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-xl"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-36">
                    <Image
                      src={SwapSkillCard}
                      alt="SwapSkill Platform - Skill sharing community"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                    
                    {/* Card content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-sm mb-1">SwapSkill</div>
                          <div className="text-white/70 text-xs">Platform</div>
                        </div>
                        <div className="w-10 h-10 bg-purple-600/90 backdrop-blur rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">S</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Exchange Card */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1, y: -8 }}
                className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 shadow-xl"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-36">
                    <Image
                      src={SkillExchange}
                      alt="Skill Exchange - Knowledge sharing network"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                    
                    {/* Card content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-sm mb-1">Exchange</div>
                          <div className="text-white/70 text-xs">Skills</div>
                        </div>
                        <motion.div 
                          className="w-10 h-10 bg-blue-600/90 backdrop-blur rounded-lg flex items-center justify-center shadow-lg"
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <span className="text-white font-bold text-sm">🔄</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Rating Section */}
            <motion.div
              custom={3}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 flex justify-center lg:justify-start"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100/50 inline-flex items-center gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2">Excellent Reviews</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
                        className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm"
                      >
                        <span className="text-white text-xs">★</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
                  <div className="text-xs text-gray-500">out of 5</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right side - Enhanced Content */}
          <div className="space-y-8 lg:pl-8">
            <motion.div
              custom={4}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm tracking-wider uppercase bg-purple-50 px-4 py-2 rounded-full"
            >
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              About Our Mission
            </motion.div>
            
            <motion.h2
              custom={5}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Transforming{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Skills
              </span>
              <br />
              Into{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Opportunities
              </span>
            </motion.h2>
            
            <motion.p
              custom={6}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-xl text-gray-600 leading-relaxed font-light"
            >
              Join a revolutionary platform where knowledge becomes currency and skills transform into lasting connections. 
              We're building the future of{" "}
              <span className="font-semibold text-purple-600 relative">
                collaborative learning
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
              </span>
              .
            </motion.p>
            
            <motion.p
              custom={7}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              From seasoned professionals to passionate learners, our ecosystem empowers you to{" "}
              <span className="font-semibold text-emerald-600">monetize expertise</span>,{" "}
              <span className="font-semibold text-blue-600">acquire new capabilities</span>, and{" "}
              <span className="font-semibold text-orange-600">forge meaningful partnerships</span>{" "}
              across the global community.
            </motion.p>

            {/* Enhanced Feature Grid */}
            <motion.div
              custom={8}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6 pt-6"
            >
              {[
                { icon: "🔄", title: "Skill Exchange", desc: "Seamless trading", gradient: "from-emerald-400 to-blue-500" },
                { icon: "🎓", title: "Learn & Grow", desc: "Continuous development", gradient: "from-purple-400 to-pink-500" },
                { icon: "💰", title: "Earn Rewards", desc: "Monetize talents", gradient: "from-yellow-400 to-orange-500" },
                { icon: "🌍", title: "Global Network", desc: "Worldwide connections", gradient: "from-blue-400 to-indigo-500" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                    <span className="text-white text-lg">{feature.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Enhanced CTA Button */}
            <motion.div
              custom={9}
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                
                <span className="relative flex items-center justify-center gap-3 z-10">
                  Start Your Journey
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xl"
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              {/* Supporting text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-gray-500 mt-3 flex items-center gap-2"
              >
                <span className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
                Free to join • No credit card required
              </motion.p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}






