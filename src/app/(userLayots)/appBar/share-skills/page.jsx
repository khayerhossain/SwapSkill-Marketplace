"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function SkillForm() {
  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    gender: "",
    homeTown: "",
    studyOrWorking: "",
    userImage: "",
    category: "",
    description: "",
    experience: "",
    availability: "",
    availabilityType: "",
    location: "",
    timeZone: "",
    skillsToTeach: "",
    skillsToLearn: "",
    swapPreference: "",
    portfolioLink: "",
    languages: "",
    tags: "",
    responseTime: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });

  // 🔹 audio state (null by default)
  const [audio, setAudio] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const { addNotification } = useNotification();

  // 🔹 Ensure Audio runs only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio("/sounds/notification.mp3"));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, userImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 🔹 Play notification sound (if loaded)
        if (audio) audio.play();

        addNotification({
          title: "Do you want to start the Quiz?",
          message: "Choose your option!",
          type: "formSuccess",
          profileId: data.insertedId,
          userId: "current-user-id", // replace with actual user ID
          category: formData.category || "General",
        });

        // Reset form
        setFormData({
          userName: "", age: "", gender: "", homeTown: "", studyOrWorking: "",
          userImage: "", category: "", description: "", experience: "",
          availability: "", availabilityType: "", location: "", timeZone: "",
          skillsToTeach: "", skillsToLearn: "", swapPreference: "",
          portfolioLink: "", languages: "", tags: "", responseTime: "",
          email: "", phone: "", facebook: "", instagram: "", twitter: ""
        });
        setImagePreview(null);

      } else {
        addNotification({
          title: "Error!",
          message: data.error || "Something went wrong.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      addNotification({
        title: "Error!",
        message: "Submission failed.",
        type: "error",
      });
    }
  };

  return (
    <section className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-left">
        Share Your Skills
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* User Name */}
        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          value={formData.userName}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
          required
        />

        {/* Age */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* Home Town */}
        <input
          type="text"
          name="homeTown"
          placeholder="Home Town"
          value={formData.homeTown}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Study/Working */}
        <input
          type="text"
          name="studyOrWorking"
          placeholder="Study or Working"
          value={formData.studyOrWorking}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Image (20%) + Description (80%) */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          {/* Image Upload */}
          <div className="md:col-span-1 flex flex-col items-center border-2 border-dashed border-gray-400 p-4 rounded-lg">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="h-32 w-32 flex items-center justify-center border border-gray-300 rounded-lg mb-2">
                <span className="text-gray-500 text-xs text-center">
                  Upload
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="px-3 py-1 bg-black text-white text-sm rounded-lg cursor-pointer hover:bg-gray-800"
            >
              Choose
            </label>
          </div>

          {/* Description */}
          <div className="md:col-span-4">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg h-32 lg:h-[200px] resize-none"
            />
          </div>
        </div>

        {/* Category */}
        <select
          type="text"
          name="category"
          placeholder="Skill Category"
          value={formData.category}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        >
          <option value="">Select Availability Category</option>
          <option>Programming</option>
          <option>Design</option>
          <option>Dance</option>
          <option>Sports</option>
          <option>Teamwork</option>
          <option>Marketing</option>          
          </select>   

          
        {/* Skills To Teach */}
        <input
          type="text"
          name="skillsToTeach"
          placeholder="Skills to Teach (comma separated)"
          value={formData.skillsToTeach}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Skills To Learn */}
        <input
          type="text"
          name="skillsToLearn"
          placeholder="Skills to Learn (comma separated)"
          value={formData.skillsToLearn}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Experience */}
        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g. 2 years)"
          value={formData.experience}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Availability */}
        <input
          type="text"
          name="availability"
          placeholder="Availability (e.g. Weekends)"
          value={formData.availability}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Availability Type */}
        <select
          name="availabilityType"
          value={formData.availabilityType}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        >
          <option value="">Select Availability Type</option>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Time Zone */}
        <input
          type="text"
          name="timeZone"
          placeholder="Time Zone (e.g. Asia/Dhaka)"
          value={formData.timeZone}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Swap Preference */}
        <input
          type="text"
          name="swapPreference"
          placeholder="Swap Preference"
          value={formData.swapPreference}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Portfolio Link */}
        <input
          type="text"
          name="portfolioLink"
          placeholder="Portfolio Link"
          value={formData.portfolioLink}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Languages */}
        <input
          type="text"
          name="languages"
          placeholder="Languages (comma separated)"
          value={formData.languages}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Response Time */}
        <input
          type="text"
          name="responseTime"
          placeholder="Response Time (e.g. Within 24 hours)"
          value={formData.responseTime}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />

        {/* Contact Info */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

        {/* Social Media */}
        <input
          type="text"
          name="facebook"
          placeholder="Facebook Link"
          value={formData.facebook}
          onChange={handleChange}
          className="col-span-2 p-3 border border-gray-400 rounded-lg"
        />
        <input
          type="text"
          name="instagram"
          placeholder="Instagram Link"
          value={formData.instagram}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />
        <input
          type="text"
          name="twitter"
          placeholder="Twitter Link"
          value={formData.twitter}
          onChange={handleChange}
          className="col-span-1 p-3 border border-gray-400 rounded-lg"
        />

  {/* Submit */}
        <button
          type="submit"
          className="col-span-2 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
