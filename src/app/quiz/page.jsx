"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizComponent from '@/components/shared/test-components/QuizComponent';
import VerificationPopup from '@/components/shared/test-components/VerificationPopup';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const profileId = searchParams.get('profileId')?.toString() || '';
  const userId = searchParams.get('userId')?.toString() || '';
  const category = searchParams.get('category')?.toString() || '';
  const showPopup = searchParams.get('showPopup') === 'true';
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Navigation guard for quiz in progress
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isQuizStarted) {
        e.preventDefault();
        e.returnValue = 'Your quiz is in progress. Leaving will lose your progress!';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isQuizStarted]);

  // Initialize page
  useEffect(() => {
    if (!profileId || !userId || !category) {
      // Try to get from localStorage if URL params are missing
      const savedProfileId = localStorage.getItem('currentProfileId');
      const savedUserId = localStorage.getItem('currentUserId');
      const savedCategory = localStorage.getItem('currentCategory');
      
      if (savedProfileId && savedUserId && savedCategory) {
        setProfileData({ 
          category: savedCategory,
          profileId: savedProfileId,
          userId: savedUserId
        });
        
        if (window.location.search.includes('showPopup=true')) {
          setIsPopupOpen(true);
        } else {
          setIsQuizStarted(true);
        }
      } else {
        setPageLoading(false);
        return;
      }
    } else {
      // Save to localStorage for backup
      localStorage.setItem('currentProfileId', profileId);
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('currentCategory', category);

      if (showPopup) {
        setIsPopupOpen(true);
        setProfileData({ category, profileId, userId });
      } else {
        setIsQuizStarted(true);
      }
    }
    
    setPageLoading(false);
  }, [profileId, userId, category, showPopup]);

  const handleStartTest = () => {
    setIsPopupOpen(false);
    setIsQuizStarted(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    router.push('/appBar/find-skills');
  };

  const handleQuizComplete = (result) => {
    console.log('Quiz completed:', result);
    // Clear localStorage on completion
    localStorage.removeItem('currentProfileId');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentCategory');
  };

  const getErrorReason = () => {
    if (!profileId && !localStorage.getItem('currentProfileId')) return 'Profile ID missing';
    if (!userId && !localStorage.getItem('currentUserId')) return 'User ID missing';
    if (!category && !localStorage.getItem('currentCategory')) return 'Category not specified';
    return 'Unknown error';
  };

  // Page loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Preparing Quiz</h3>
          <p className="text-gray-500 mt-2">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // Invalid access
  const hasValidData = (
    (profileId || localStorage.getItem('currentProfileId')) &&
    (userId || localStorage.getItem('currentUserId')) &&
    (category || localStorage.getItem('currentCategory'))
  );

  if (!hasValidData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">❌A2......</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Quiz Access</h2>
          <p className="text-gray-600 mb-4">Error: {getErrorReason()}</p>
          <p className="text-gray-600 mb-6">
            Quiz parameters missing. Please try again from the profile.
          </p>
          <button
            onClick={() => router.push('/appBar/share-skills')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Skills Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <VerificationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          profileData={profileData}
          onStartTest={handleStartTest}
        />

        {isQuizStarted && (
          <QuizComponent
            profileId={profileId || localStorage.getItem('currentProfileId')}
            userId={userId || localStorage.getItem('currentUserId')}
            category={category || localStorage.getItem('currentCategory')}
            onComplete={handleQuizComplete}
          />
        )}

        {!isPopupOpen && !isQuizStarted && (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz System</h2>
              <p className="text-gray-600 mb-6">
                Your verification quiz is ready to start.
              </p>
              <button
                onClick={() => setIsQuizStarted(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}