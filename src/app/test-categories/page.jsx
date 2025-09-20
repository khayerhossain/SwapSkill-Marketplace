// src/app/test-categories/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/quiz/categories');
      const data = await response.json();
      console.log('Categories Response:', data);
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(`Network Error: ${error.message}`);
    }
    setLoading(false);
  };

  const startTestQuiz = (category) => {
    // For testing purposes, using dummy IDs
    const testProfileId = 'test_profile_id';
    const testUserId = 'test_user_id';
    
    router.push(`/quiz?profileId=${testProfileId}&userId=${testUserId}&category=${category}&showPopup=false`);
  };

  const startWithPopup = (category) => {
    const testProfileId = 'test_profile_id';
    const testUserId = 'test_user_id';
    
    router.push(`/quiz?profileId=${testProfileId}&userId=${testUserId}&category=${category}&showPopup=true`);
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Categories Test Page</h1>
        <p className="text-gray-600">Test your quiz system and see available categories</p>
      </div>
      
      <div className="mb-6">
        <button
          onClick={fetchCategories}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
        >
          {loading ? 'Loading...' : 'Refresh Categories'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {categories.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Available Categories ({categories.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{cat.category}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cat.totalQuestions >= 10 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cat.totalQuestions >= 10 ? 'Ready' : 'Limited Questions'}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-semibold">{cat.totalQuestions}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <span className="font-semibold">{cat.totalMarks}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-semibold text-blue-600">
                      {cat.passingScore}/{cat.totalMarks}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Pass Rate:</span>
                    <span className="font-semibold text-green-600">
                      {cat.passingPercentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => startTestQuiz(cat.category)}
                    disabled={cat.totalQuestions === 0}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Quiz Directly
                  </button>
                  
                  <button
                    onClick={() => startWithPopup(cat.category)}
                    disabled={cat.totalQuestions === 0}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start with Popup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No categories found</div>
          <p className="text-gray-400">Make sure your test-qna collection has data</p>
        </div>
      )}

      {/* Summary Stats */}
      {categories.length > 0 && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {categories.reduce((acc, cat) => acc + cat.totalQuestions, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {categories.filter(cat => cat.totalQuestions >= 10).length}
              </div>
              <div className="text-sm text-gray-600">Ready Categories</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  categories.reduce((acc, cat) => acc + cat.passingPercentage, 0) / categories.length
                ) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Pass Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}