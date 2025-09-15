"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';

const textVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  }),
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"
        />
        <motion.div
          animate={{
            backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"
        />
      </div>

      {/* Floating Paper Plane */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-1/4 z-0"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 transform rotate-45 rounded-lg opacity-20"></div>
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute bottom-20 right-1/4 z-0"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-30"></div>
      </motion.div>

      <Container>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
              {/* Decorative Top Bar */}
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
              
              {/* Card Content */}
              <div className="px-8 md:px-12 lg:px-16 py-12 md:py-16">
                <div className="text-center">
                  {/* Paper Plane Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="mx-auto mb-8"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 mx-auto">
                      <motion.div
                        animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="transform -rotate-12"
                      >
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h2
                    custom={1}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                  >
                    <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      SUBSCRIBE
                    </span>
                    <span className="text-red-500">.</span>
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                  >
                    Stay updated with the latest skill exchange opportunities, success stories, 
                    and exclusive tips to maximize your SwapSkill experience.
                  </motion.p>

                  {/* Subscription Form */}
                  {!isSubscribed ? (
                    <motion.form
                      custom={3}
                      variants={textVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      onSubmit={handleSubmit}
                      className="max-w-md mx-auto"
                    >
                      <div className="relative">
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                          className="w-full px-6 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-300 text-lg"
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer w-full mt-4 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Subscribing...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            SUBSCRIBE
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </span>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="max-w-md mx-auto"
                    >
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 mb-2">Successfully Subscribed!</h3>
                        <p className="text-green-700">Thank you for joining our community. Check your inbox for a welcome email.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Trust Indicators */}
                  <motion.div
                    custom={4}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>No Spam, Ever</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Unsubscribe Anytime</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20"></div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            custom={5}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Subscribers</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-pink-600 mb-2">Weekly</div>
              <div className="text-gray-600">Curated Content</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-rose-600 mb-2">0% Spam</div>
              <div className="text-gray-600">Quality Guarantee</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}