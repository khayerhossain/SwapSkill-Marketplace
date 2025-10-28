"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
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

export default function Profile() {
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
      const response = await axiosInstance.get("/profile/update");
      if (response.status === 200) {
        const data = response.data;
        setProfile(data);
        setEditData(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  //post count tomal-dev

  const [postCount, setPostCount] = useState(0);  

    useEffect(() => {
    if (!session?.user?.email) return;

    const fetchPostCount = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user-post-count?email=${session.user.email}`
        );

        if (data.success) {
          setPostCount(data.totalPosts);
        }
      } catch (error) {
        console.log("Error fetching post count:", error);
      }
    };

    fetchPostCount();
  }, [session]);


  // follow count

 const [followCount, setFollowCount] = useState(0);

    useEffect(() => {
    if (!session?.user?.email) return;

    const fetchFollowCount = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/follows?email=${session.user.email}`
        );

        if (data.success) {
          setFollowCount(data.totalPosts);
        }
      } catch (error) {
        console.log("Error fetching post count:", error);
      }
    };

    fetchFollowCount();
  }, [session]);


  ///////////// tomal-dev ////////////////////

  // Image Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axiosInstance.post("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const result = response.data;

      if (response.status === 200) {
        const updatedProfile = {
          ...profile,
          profileImage: result.imageUrl,
        };
        setProfile(updatedProfile);
        setEditData(updatedProfile);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile image updated!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setMessage(result.error || " Image upload failed");
      }
    } catch (error) {
      setMessage(" Error uploading image");
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
      setMessage(" Name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put("/profile/update", {
        name: editData.name,
        bio: editData.bio,
        skills: (editData.skills || []).filter((s) => s.trim() !== ""),
        contactInfo: editData.contactInfo || {},
      });

      const result = response.data;

      if (response.status === 200) {
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
    <div className="min-h-screen text-gray-200 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-red-500">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="bg-[#121212] border border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="relative inline-block mb-4 group">
                  <div className="mb-4">
                    {session?.user ? (
                      <Image
                        src={profile?.profileImage || session.user.image}
                        alt="User avatar"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border-2 border-red-600 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#1a1a1a] border border-gray-700 text-3xl font-semibold text-gray-300">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
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

                {/* Name & Info */}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="input input-bordered input-sm w-full text-center font-semibold mb-2 bg-gray-800 text-white"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-xl font-semibold mb-1 text-gray-100">
                    {profile?.name || session?.user?.name || "User"}
                  </h2>
                )}

                <p className="text-gray-400 text-sm">
                  {session?.user?.email || "user@example.com"}
                </p>
                <div className="badge bg-red-600 mt-2 px-3 py-1 text-white">
                  {profile?.role || session?.user?.role || "User"}
                </div>


        <div className="flex justify-around mt-6 text-sm text-gray-300 gap-6">
          <div className="text-center">
            <p className="font-bold text-lg text-white">{postCount}</p>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">0</p>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">{followCount}</p>
            <span className="text-gray-400">Following</span>
          </div>
        </div>                



              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border border-gray-700 shadow-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-white  ">
                  Profile Information
                </h3>
                <button
                  onClick={handleEditToggle}
                  className="btn text-white rounded-lg bg-red-600 btn-sm hover:scale-105 transition  border-0"
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
                  <label className="text-sm font-medium text-gray-400">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="textarea textarea-bordered w-full mt-1 bg-gray-800 text-white placeholder-gray-400"
                      rows="2"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-200 text-lg mt-1">
                      {profile?.bio || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-400">
                      Skills
                    </label>
                    {isEditing && (
                      <button
                        onClick={addSkill}
                        className="btn bg-red-600 text-stone-50 btn-outline hover:bg-red-600 hover:text-gray-900 border-0"
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
                            className="input input-bordered input-sm flex-1 bg-gray-800 text-white placeholder-gray-400"
                            placeholder="Skill"
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="btn bg-red-600 text-stone-50 btn-sm border-0"
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
                          <span
                            key={i}
                            className="badge badge-outline text-white border-gray-500"
                          >
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
                  <label className="text-sm font-medium text-gray-400">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contactInfo?.phone || ""}
                      onChange={(e) =>
                        handleContactInfoChange("phone", e.target.value)
                      }
                      className="input input-bordered input-sm w-full mt-1 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Phone number"
                    />
                  ) : (
                    <p className="text-gray-200 text-lg mt-1">
                      {profile?.contactInfo?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contactInfo?.location || ""}
                      onChange={(e) =>
                        handleContactInfoChange("location", e.target.value)
                      }
                      className="input input-bordered input-sm w-full mt-1 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-200 text-lg mt-1">
                      {profile?.contactInfo?.location || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Member Since
                  </label>
                  <p className="text-gray-200 text-lg mt-1">
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
                    className="btn bg-red-600 text-stone-50 border-0 hover:scale-105 transition"
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