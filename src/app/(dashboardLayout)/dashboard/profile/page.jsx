"use client";

import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCog } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen text-gray-200 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-red-500">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="bg-[#121212] border border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="User avatar"
                      className="w-24 h-24 rounded-full border-2 border-red-600 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#1a1a1a] border border-gray-700 text-3xl font-semibold text-gray-300">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-gray-100">
                  {session?.user?.name || "User"}
                </h2>
                <p className="text-sm text-gray-400">
                  {session?.user?.email || "user@example.com"}
                </p>

                <div className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded-full capitalize">
                  {session?.user?.role || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-100 mb-6">
                Profile Information
              </h3>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="flex items-start gap-4">
                  <FaUser className="text-red-500 text-lg mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-lg font-medium text-gray-100">
                      {session?.user?.name || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-red-500 text-lg mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg font-medium text-gray-100">
                      {session?.user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-start gap-4">
                  <FaCalendarAlt className="text-red-500 text-lg mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-lg font-medium text-gray-100">
                      January 2024
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-4">
                  <FaCog className="text-red-500 text-lg mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="text-lg font-medium text-gray-100 capitalize">
                      {session?.user?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Skills Shared
            </h3>
            <p className="text-gray-400">You have shared 0 skills</p>
            <button className="mt-4 px-4 py-2 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all">
              View Skills
            </button>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">
              Skills Learned
            </h3>
            <p className="text-gray-400">You have learned 0 skills</p>
            <button className="mt-4 px-4 py-2 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all">
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
