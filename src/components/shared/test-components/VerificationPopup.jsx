"use client";

import { useState } from "react";
import { FaBroom, FaGraduationCap, FaHourglassStart, FaTrophy } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { BsFillPatchQuestionFill } from "react-icons/bs";

export default function VerificationPopup({
  isOpen,
  onClose,
  profileData,
  onStartTest,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartTest = async () => {
    setLoading(true);
    try {
      await onStartTest();
    } catch (error) {
      console.error("Test start error:", error);
      alert("There was a problem starting the test");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-2 border-gray-100 transform transition-all duration-300">
        <div className="text-center mb-8">
          <div className="text-7xl mb-6 flex items-center justify-center animate-bounce">
            {" "}
            <FaGraduationCap size={50} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 leading-tight">
            Profile Saved Successfully!
          </h2>
          <p className="text-lg text-gray-600 mt-2">Time for verification</p>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-6 text-center">
            Great job! Your profile is saved. Now take a quick test to become a{" "}
            <span className="font-bold text-blue-600">Verified Teacher</span>{" "}
            and unlock special features.
          </p>

          <div className=" p-6 rounded-2xl border-2 border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <span className="text-gray-800 font-bold text-lg">
                Test Category:
              </span>
              <span className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-xl font-bold">
                {profileData?.category || "Programming"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl mr-2">
                  {" "}
                  <MdOutlineWatchLater size={28} />
                </span>
                <div>
                  <div className="font-bold text-gray-800">30 minutes</div>
                  <div className="text-gray-600">Time limit</div>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl mr-2">
                  <BsFillPatchQuestionFill />
                </span>
                <div>
                  <div className="font-bold text-gray-800">10 questions</div>
                  <div className="text-gray-600">Total questions</div>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl mr-2">
                  {" "}
                  <FaBroom size={28} />
                </span>
                <div>
                  <div className="font-bold text-gray-800">70% to pass</div>
                  <div className="text-gray-600">Passing score</div>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-2xl mr-2">
                  <FaTrophy size={28} />
                </span>
                <div>
                  <div className="font-bold text-gray-800">Badge reward</div>
                  <div className="text-gray-600">Gold/Silver/Bronze</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-4 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50"
          >
            <MdOutlineWatchLater size={28} /> Do it later
          </button>

          <button
            onClick={handleStartTest}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-bold transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaHourglassStart size={20} />
                <span>Start Test Now</span>
              </div>
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            💡 Pass the test to get a{" "}
            <span className="font-semibold">Verified Badge</span> on your
            profile and access premium features!
          </p>
        </div>
      </div>
    </div>
  );
}
