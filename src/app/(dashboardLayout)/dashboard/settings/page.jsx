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
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-primary text-xl" />
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Display Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your display name" 
                  className="input input-bordered w-full max-w-md" 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="input input-bordered w-full max-w-md" 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full max-w-md" 
                  placeholder="Tell us about yourself"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaBell className="text-primary text-xl" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Email Notifications</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Push Notifications</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  />
                </label>
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">SMS Notifications</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-primary text-xl" />
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Profile Visibility</span>
                </label>
                <select 
                  className="select select-bordered w-full max-w-md"
                  value={privacy.profileVisibility}
                  onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skills Visibility</span>
                </label>
                <select 
                  className="select select-bordered w-full max-w-md"
                  value={privacy.skillVisibility}
                  onChange={(e) => setPrivacy({...privacy, skillVisibility: e.target.value})}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact Information</span>
                </label>
                <select 
                  className="select select-bordered w-full max-w-md"
                  value={privacy.contactInfo}
                  onChange={(e) => setPrivacy({...privacy, contactInfo: e.target.value})}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaPalette className="text-primary text-xl" />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Theme</span>
                </label>
                <select className="select select-bordered w-full max-w-md">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <select className="select select-bordered w-full max-w-md">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
