"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCog, FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaCamera } from "react-icons/fa";

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
      const response = await fetch('/api/profile/update');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // প্রোফাইল ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const updatedProfile = { 
          ...profile, 
          profileImage: result.imageUrl 
        };
        setProfile(updatedProfile);
        setEditData(updatedProfile);
        setMessage("Profile image updated successfully!");
      } else {
        setMessage(result.error || "Image upload failed");
      }
    } catch (error) {
      setMessage("Error uploading image");
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
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...(editData.skills || [])];
    newSkills[index] = value;
    setEditData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    setEditData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), ""]
    }));
  };

  const removeSkill = (index) => {
    const newSkills = (editData.skills || []).filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!editData.name?.trim()) {
      setMessage("Name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          skills: (editData.skills || []).filter(skill => skill.trim() !== ""),
          contactInfo: editData.contactInfo || {}
        })
      });

      const result = await response.json();

      if (response.ok) {
        setProfile(editData);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.error || "Update failed");
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {message && (
          <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"} mb-4`}>
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-lg p-6">
              <div className="text-center">
                {/* Profile Image with Upload */}
                <div className="relative inline-block mb-4">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center relative">
                      {profile?.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : null}
                      <div className={`absolute inset-0 rounded-full bg-primary text-primary-content flex items-center justify-center ${profile?.profileImage ? 'hidden' : 'flex'}`}>
                        <span className="text-3xl">
                          {(profile?.name || session?.user?.name)?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Upload Button */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageLoading}
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary-focus transition-colors"
                    title="Change profile image"
                  >
                    {imageLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <FaCamera className="text-xs" />
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

                {/* Name Only */}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input input-bordered input-sm w-full text-center font-semibold mb-2"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-xl font-semibold mb-2">
                    {profile?.name || session?.user?.name || "User"}
                  </h2>
                )}
                
                <p className="text-base-content/70">
                  {session?.user?.email || "user@example.com"}
                </p>
                <div className="badge badge-primary mt-2">
                  {profile?.role || session?.user?.role || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Profile Information</h3>
                <button 
                  onClick={handleEditToggle}
                  className="btn btn-primary btn-sm"
                >
                  {isEditing ? <FaTimes className="mr-1" /> : <FaEdit className="mr-1" />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Bio Section */}
                <div className="flex items-start gap-3">
                  <FaUser className="text-primary mt-1" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-base-content/70">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio || ""}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="textarea textarea-bordered w-full mt-1"
                        rows="2"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-lg">
                        {profile?.bio || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="flex items-start gap-3">
                  <FaCog className="text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-base-content/70">
                        Skills
                      </label>
                      {isEditing && (
                        <button onClick={addSkill} className="btn btn-xs btn-outline">
                          <FaPlus className="mr-1" />
                          Add Skill
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
                              onChange={(e) => handleSkillChange(index, e.target.value)}
                              className="input input-bordered input-sm flex-1"
                              placeholder="Skill name"
                            />
                            <button 
                              onClick={() => removeSkill(index)}
                              className="btn btn-error btn-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        {(editData.skills?.length === 0 || !editData.skills) && (
                          <p className="text-base-content/70 text-sm">No skills added yet</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile?.skills?.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span key={index} className="badge badge-outline">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-base-content/70">No skills added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">
                      Email
                    </label>
                    <p className="text-lg">
                      {session?.user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaUser className="text-primary" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-base-content/70">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contactInfo?.phone || ""}
                        onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        className="input input-bordered input-sm w-full mt-1"
                        placeholder="Phone number"
                      />
                    ) : (
                      <p className="text-lg">
                        {profile?.contactInfo?.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCog className="text-primary" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-base-content/70">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contactInfo?.location || ""}
                        onChange={(e) => handleContactInfoChange('location', e.target.value)}
                        className="input input-bordered input-sm w-full mt-1"
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-lg">
                        {profile?.contactInfo?.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-primary" />
                  <div>
                    <label className="text-sm font-medium text-base-content/70">
                      Member Since
                    </label>
                    <p className="text-lg">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "January 2024"}
                    </p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary"
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