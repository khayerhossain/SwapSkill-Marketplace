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

  const [audio, setAudio] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const { addNotification } = useNotification();

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
        if (audio) audio.play();

        addNotification({
          title: "Do you want to start the Quiz?",
          message: "Choose your option!",
          type: "formSuccess",
          profileId: data.insertedId,
          userId: "current-user-id",
          category: formData.category || "General",
        });

        setFormData({
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

  // 🔹 Reusable Floating Input
  const FloatingInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    className = "",
    ...props
  }) => (
    <div className={`relative ${className}`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="peer w-full p-3 border border-gray-400 rounded-lg bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-black"
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 
          peer-placeholder-shown:text-base peer-focus:-top-2.5 
          peer-focus:text-sm peer-focus:text-black"
      >
        {label}
      </label>
    </div>
  );

  // 🔹 Reusable Floating Textarea
  const FloatingTextarea = ({
    label,
    name,
    value,
    onChange,
    className = "",
  }) => (
    <div className={`relative ${className}`}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="peer w-full p-3 border border-gray-400 rounded-lg bg-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-black resize-none h-32 lg:h-[200px]"
        placeholder={label}
      />
      <label
        htmlFor={name}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 
          peer-placeholder-shown:text-base peer-focus:-top-2.5 
          peer-focus:text-sm peer-focus:text-black"
      >
        {label}
      </label>
    </div>
  );

  // 🔹 Reusable Floating Select
  const FloatingSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    className = "",
  }) => (
    <div className={`relative ${className}`}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="peer w-full p-3 border border-gray-400 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="" disabled hidden></option>
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600"
      >
        {label}
      </label>
    </div>
  );

  return (
    <section className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-left">
        Share Your Skills
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <FloatingInput
          label="Full Name"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        <FloatingSelect
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={["Male", "Female", "Other"]}
        />

        <FloatingInput
          label="Home Town"
          name="homeTown"
          value={formData.homeTown}
          onChange={handleChange}
        />
        <FloatingInput
          label="Study or Working"
          name="studyOrWorking"
          value={formData.studyOrWorking}
          onChange={handleChange}
          className="col-span-2"
        />

        {/* Image + Description */}
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
          <FloatingTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="md:col-span-4"
          />
        </div>

        <FloatingSelect
          label="Skill Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            "Programming",
            "Design",
            "Dance",
            "Sports",
            "Teamwork",
            "Marketing",
            "Music",
            "Cooking",
            "Photography",
            "Writing",
            "Driving",
            "Handwriting",
            "Swimming",
            "Fishing",
            "Other",
          ]}
          className="col-span-2"
        />

        <FloatingInput
          label="Skills to Teach (comma separated)"
          name="skillsToTeach"
          value={formData.skillsToTeach}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Skills to Learn (comma separated)"
          name="skillsToLearn"
          value={formData.skillsToLearn}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Experience (e.g. 2 years)"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
        <FloatingInput
          label="Availability (e.g. Weekends)"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
        />

        <FloatingSelect
          label="Availability Type"
          name="availabilityType"
          value={formData.availabilityType}
          onChange={handleChange}
          options={["Online", "Offline", "Hybrid"]}
        />

        <FloatingInput
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <FloatingInput
          label="Time Zone (e.g. Asia/Dhaka)"
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Swap Preference"
          name="swapPreference"
          value={formData.swapPreference}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Portfolio Link"
          name="portfolioLink"
          value={formData.portfolioLink}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Languages (comma separated)"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Response Time (e.g. Within 24 hours)"
          name="responseTime"
          value={formData.responseTime}
          onChange={handleChange}
          className="col-span-2"
        />

        <FloatingInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FloatingInput
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <FloatingInput
          label="Facebook Link"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          className="col-span-2"
        />
        <FloatingInput
          label="Instagram Link"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
        <FloatingInput
          label="Twitter Link"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
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
