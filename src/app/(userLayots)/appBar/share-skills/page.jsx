"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

export default function SkillForm() {
  const [formData, setFormData] = useState({
    userName: "",
    category: "",
    description: "",
    skills: "",
    experience: "",
    availability: "",
    location: "",
    rating: "",
    imageUrl: "",
    gender: "",
    studyOrWorking: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const newProfileId = data.profileId || data.insertedId;
        
        // User ID - Get from your authentication system
        const userId = "current-user-id"; // Replace with actual user ID
        
        Swal.fire({
          title: "Do you want to start the Quiz?",
          text: "Choose your option!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, go to Quiz!",
          cancelButtonText: "No, go to Find Page",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/quiz?profileId=${newProfileId}&userId=${userId}&category=${encodeURIComponent(formData.category)}&showPopup=true`);
          } else if (result.isDismissed) {
            router.push("/find-skills");
          }
        });
      } else {
        Swal.fire("Error!", data.error || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire("Error!", "Submission failed.", "error");
    }

    setFormData({
      userName: "",
      category: "",
      description: "",
      skills: "",
      experience: "",
      availability: "",
      location: "",
      rating: "",
      gender: "",
      imageUrl: "",
      studyOrWorking: "",
    });
  };

  return (
    <section className="max-w-2xl mx-auto bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-2xl border border-orange-200">
      <h2 className="text-3xl font-extrabold mb-6 text-orange-600 text-center tracking-wide">
        Add Your Skill
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="userName"
            placeholder="Your Name"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="UI/UX">UI/UX</option>
          </select>
        </div>

        {/* Study Or Working */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Study Or Working
          </label>
          <input
            type="text"
            name="studyOrWorking"
            placeholder="Study Or Working"
            value={formData.studyOrWorking}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none h-24"
            required
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Rating
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            placeholder="Your Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Experience
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1 Year">1-2 Years</option>
            <option value="2 Years">3-4 Years</option>
            <option value="3 Years">5+ Years</option>
          </select>
        </div>

        {/* Availability */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Availability
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select Availability</option>
            <option value="weekends(sat-sun)">Weekends (Sat-Sun)</option>
            <option value="weekends(sun-wed)">Weekends (Sun-Wed)</option>
            <option value="weekends(fri-mon)">Weekends (Fri-Mon)</option>
            <option value="weekends(thu-sun)">Weekends (Thu-Sun)</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Image Url (optional)
          </label>
          <input
            type="text"
            name="imageUrl"
            placeholder="Enter image URL or leave blank"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
}