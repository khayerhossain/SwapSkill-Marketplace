"use client";

import { useState } from "react";
import { FaUser, FaBell, FaShieldAlt, FaPalette } from "react-icons/fa";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    skillVisibility: "public",
    contactInfo: "private",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-red-500">Settings</h1>

        {/* Account Settings */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-red-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-100">
              Account Settings
            </h2>
          </div>

          <div className="space-y-5 max-w-md">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your display name"
                className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself"
                rows="3"
                className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaBell className="text-red-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-100">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {[
              "Email Notifications",
              "Push Notifications",
              "SMS Notifications",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 rounded-lg"
              >
                <span className="text-gray-300">{item}</span>
                <input
                  type="checkbox"
                  className="toggle toggle-error"
                  checked={
                    idx === 0
                      ? notifications.email
                      : idx === 1
                      ? notifications.push
                      : notifications.sms
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [idx === 0 ? "email" : idx === 1 ? "push" : "sms"]:
                        e.target.checked,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaShieldAlt className="text-red-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-100">
              Privacy Settings
            </h2>
          </div>

          <div className="space-y-5 max-w-md">
            {[
              {
                label: "Profile Visibility",
                value: privacy.profileVisibility,
                key: "profileVisibility",
              },
              {
                label: "Skills Visibility",
                value: privacy.skillVisibility,
                key: "skillVisibility",
              },
              {
                label: "Contact Information",
                value: privacy.contactInfo,
                key: "contactInfo",
              },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  {item.label}
                </label>
                <select
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  value={item.value}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, [item.key]: e.target.value })
                  }
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaPalette className="text-red-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-100">Appearance</h2>
          </div>

          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Theme
              </label>
              <select className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Language
              </label>
              <select className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
