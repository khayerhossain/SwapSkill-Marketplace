"use client";

import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCog } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-lg p-6">
              <div className="text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-24">
                    <span className="text-3xl">
                      {session?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold">{session?.user?.name || "User"}</h2>
                <p className="text-base-content/70">{session?.user?.email || "user@example.com"}</p>
                <div className="badge badge-primary mt-2">
                  {session?.user?.role || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Full Name</label>
                    <p className="text-lg">{session?.user?.name || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Email</label>
                    <p className="text-lg">{session?.user?.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Member Since</label>
                    <p className="text-lg">January 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCog className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Role</label>
                    <p className="text-lg capitalize">{session?.user?.role || "User"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Profile Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Skills Shared</h3>
            <p className="text-base-content/70">You have shared 0 skills</p>
            <button className="btn btn-outline btn-sm mt-2">View Skills</button>
          </div>

          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Skills Learned</h3>
            <p className="text-base-content/70">You have learned 0 skills</p>
            <button className="btn btn-outline btn-sm mt-2">View Progress</button>
          </div>
        </div>
      </div>
    </div>
  );
}
