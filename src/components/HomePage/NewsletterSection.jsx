"use client";
import React, { useState } from 'react';
import Container from '@/components/shared/Container';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-red-50/30 to-pink-50/30 min-h-screen flex items-center overflow-hidden">
      {/* Background gradient matching the image */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-pink-400/10 to-red-500/20"></div>
      
      {/* Subtle curved background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="w-full h-full bg-gradient-to-bl from-red-500/80 to-pink-600/80 rounded-l-[200px]"></div>
      </div>

      <Container>
        <div className="relative z-10 max-w-lg mx-auto w-full">
          {/* Main Card - exact white card like image */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 relative">
            
            {/* Paper plane icon - positioned like in image */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg className="w-16 h-16 text-red-500 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                {/* Curved line behind plane like in image */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <svg className="w-20 h-8 text-gray-200" viewBox="0 0 80 32" fill="none">
                    <path d="M2 16C20 8, 40 8, 78 16" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.3"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* SUBSCRIBE heading - exact typography from image */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                SUBSCRIBE<span className="text-red-500">.</span>
              </h1>
            </div>

            {/* Form - exactly like in image */}
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-0 py-3 text-gray-600 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors duration-300 text-center placeholder-gray-400"
                  />
                </div>
                
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Subscribing...
                      </div>
                    ) : (
                      "SUBSCRIBE"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Successfully Subscribed!</h3>
                  <p className="text-green-700">Thank you for joining our community.</p>
                </div>
              </div>
            )}

            {/* Decorative circles like in image */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-400/30 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400/30 rounded-full"></div>
          </div>

          {/* Circular background element like in image */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white/20 rounded-full -z-10"></div>
        </div>
      </Container>
    </section>
  );
}