<<<<<<< HEAD
=======


>>>>>>> f35569a8c221de501ce522492dd194e6813f43e2
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCog,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaCamera,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  // Fetch profile data
  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile/update");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Image Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const updatedProfile = {
          ...profile,
          profileImage: result.imageUrl,
        };
        setProfile(updatedProfile);
        setEditData(updatedProfile);
        setMessage("✅ Profile image updated successfully!");
      } else {
        setMessage(result.error || "❌ Image upload failed");
      }
    } catch (error) {
      setMessage("⚠️ Error uploading image");
      console.error("Image upload error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(profile);
    }
    setIsEditing(!isEditing);
    setMessage("");
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...(editData.skills || [])];
    newSkills[index] = value;
    setEditData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const addSkill = () => {
    setEditData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }));
  };

  const removeSkill = (index) => {
    const newSkills = (editData.skills || []).filter((_, i) => i !== index);
    setEditData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!editData.name?.trim()) {
      setMessage("⚠️ Name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          skills: (editData.skills || []).filter((s) => s.trim() !== ""),
          contactInfo: editData.contactInfo || {},
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setProfile(editData);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.error || "failed");
      }
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="skeleton h-64"></div>
            <div className="lg:col-span-2 skeleton h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {message && (
          <div
            className={`alert shadow-lg mb-6 ${
              message.includes("✅") ? "alert-success" : "alert-error"
            }`}
          >
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4 group">
                  <div className="avatar">
                    <div className="w-28 h-28 rounded-full ring-4 ring-base-200 overflow-hidden shadow-md">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-red-100 text-4xl font-bold">
                          {(profile?.name || session?.user?.name)
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageLoading}
                    className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 transition"
                    title="Change profile image"
                  >
                    {imageLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <FaCamera className="text-sm" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Name */}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="input input-bordered input-sm w-full text-center font-semibold mb-2"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-xl font-semibold mb-1">
                    {profile?.name || session?.user?.name || "User"}
                  </h2>
                )}

                <p className="text-gray-500 text-sm">
                  {session?.user?.email || "user@example.com"}
                </p>
                <div className="badge badge-error mt-2 px-3 py-1 text-white">
                  {profile?.role || session?.user?.role || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Profile Information</h3>
                <button
                  onClick={handleEditToggle}
                  className="btn btn-error btn-sm hover:scale-105 transition"
                >
                  {isEditing ? (
                    <FaTimes className="mr-1" />
                  ) : (
                    <FaEdit className="mr-1" />
                  )}
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="space-y-5">
                {/* Bio */}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="textarea textarea-bordered w-full mt-1"
                      rows="2"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-800 text-lg mt-1">
                      {profile?.bio || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-500">
                      Skills
                    </label>
                    {isEditing && (
                      <button
                        onClick={addSkill}
                        className="btn btn-xs btn-outline hover:bg-red-600 hover:text-white"
                      >
                        <FaPlus className="mr-1" />
                        Add
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      {(editData.skills || []).map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) =>
                              handleSkillChange(index, e.target.value)
                            }
                            className="input input-bordered input-sm flex-1"
                            placeholder="Skill"
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="btn btn-error btn-sm"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.skills?.length > 0 ? (
                        profile.skills.map((skill, i) => (
                          <span key={i} className="badge badge-outline">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No skills added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contactInfo?.phone || ""}
                      onChange={(e) =>
                        handleContactInfoChange("phone", e.target.value)
                      }
                      className="input input-bordered input-sm w-full mt-1"
                      placeholder="Phone number"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg mt-1">
                      {profile?.contactInfo?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contactInfo?.location || ""}
                      onChange={(e) =>
                        handleContactInfoChange("location", e.target.value)
                      }
                      className="input input-bordered input-sm w-full mt-1"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg mt-1">
                      {profile?.contactInfo?.location || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Member Since
                  </label>
                  <p className="text-gray-800 text-lg mt-1">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "January 2024"}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 text-right">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-error hover:scale-105 transition"
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <FaSave className="mr-1" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

