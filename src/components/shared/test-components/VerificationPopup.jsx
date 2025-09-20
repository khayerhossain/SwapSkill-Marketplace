"use client";

import { useState } from 'react';

export default function VerificationPopup({ 
  isOpen, 
  onClose, 
  profileData, 
  onStartTest 
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartTest = async () => {
    setLoading(true);
    try {
      await onStartTest();
    } catch (error) {
      console.error('Test start error:', error);
      alert('There was a problem starting the test');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Profile Saved — Verification Required
          </h2>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed mb-4">
            You have submitted your profile. To become a Verified teacher, you have to take a short test.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <span className="text-blue-600 font-semibold">📚 Category:</span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {profileData?.category || 'Programming'}
              </span>
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center">
                <span className="w-6">⏱️</span>
                <span>Time: 30 minutes</span>
              </div>
              <div className="flex items-center">
                <span className="w-6">❓</span>
                <span>Number of questions: 10</span>
              </div>
              <div className="flex items-center">
                <span className="w-6">✅</span>
                <span>Passing mark: 70%</span>
              </div>
              <div className="flex items-center">
                <span className="w-6">🏆</span>
                <span>Badge: Gold/Silver/Bronze</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Do it later
          </button>
          
          <button
            onClick={handleStartTest}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Loading...
              </div>
            ) : (
              'Start Test'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 If you pass the test, you will get a Verified badge and it will be shown on your profile.
          </p>
        </div>
      </div>
    </div>
  );
}