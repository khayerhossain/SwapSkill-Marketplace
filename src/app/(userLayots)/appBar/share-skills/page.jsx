"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function SkillForm() {
  // Use uncontrolled inputs for better compatibility with autofill extensions
  // Track only non-text UI state
  const [userImageData, setUserImageData] = useState("");

  const [audio, setAudio] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio("/sounds/notification.mp3"));
    }
  }, []);

  // Uncontrolled inputs: no per-field onChange required

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUserImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Collect values from the uncontrolled form
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);
      const get = (name) => (fd.get(name) || "").toString();

      // Map form names to backend keys
      const payload = {
        userName: get("name"),
        age: get("age"),
        gender: get("gender") || get("sex"),
        homeTown: get("city"),
        studyOrWorking: get("study_or_work"),
        userImage: userImageData,
        category: get("category"),
        description: get("description"),
        experience: get("experience"),
        availability: get("availability"),
        availabilityType: get("availability_type"),
        location: get("address"),
        timeZone: get("timezone"),
        skillsToTeach: get("skills_teach"),
        skillsToLearn: get("skills_learn"),
        swapPreference: get("preference"),
        portfolioLink: get("website"),
        languages: get("languages"),
        tags: get("tags"),
        responseTime: get("response_time"),
        email: get("email"),
        phone: get("tel"),
        facebook: get("facebook_url"),
        instagram: get("instagram_url"),
        twitter: get("twitter_url"),
      };

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          category: payload.category || "General",
        });

        formEl.reset();
        setImagePreview(null);
        setUserImageData("");
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

  // 🔹 Reusable Floating Input (uncontrolled)
  const FloatingInput = ({
    label,
    type = "text",
    name,
    defaultValue,
    className = "",
    autoComplete,
    ...props
  }) => (
    <div className={`relative ${className}`}>
      <input
        id={name}
        type={type}
        name={name}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
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

  // 🔹 Reusable Floating Textarea (uncontrolled)
  const FloatingTextarea = ({
    label,
    name,
    defaultValue,
    className = "",
  }) => (
    <div className={`relative ${className}`}>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
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

  // 🔹 Reusable Floating Select (uncontrolled)
  const FloatingSelect = ({
    label,
    name,
    defaultValue,
    options,
    className = "",
  }) => (
    <div className={`relative ${className}`}>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="peer w-full p-3 border border-gray-400 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="" disabled hidden></option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
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
          name="name"
          defaultValue=""
          autoComplete="name"
          required
        />
        <FloatingInput
          label="Age"
          type="number"
          name="age"
          defaultValue=""
          autoComplete="bday-year"
        />

        <FloatingSelect
          label="Gender"
          name="gender"
          defaultValue=""
          options={["Male", "Female", "Other"]}
        />

        <FloatingInput
          label="Home Town"
          name="city"
          defaultValue=""
          autoComplete="address-level2"
        />
        <FloatingInput
          label="Study or Working"
          name="study_or_work"
          defaultValue=""
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
            defaultValue=""
            className="md:col-span-4"
          />
        </div>

        <FloatingSelect
          label="Skill Category"
          name="category"
          defaultValue=""
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
          name="skills_teach"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Skills to Learn (comma separated)"
          name="skills_learn"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Experience (e.g. 2 years)"
          name="experience"
          defaultValue=""
        />
        <FloatingInput
          label="Availability (e.g. Weekends)"
          name="availability"
          defaultValue=""
        />

        <FloatingSelect
          label="Availability Type"
          name="availability_type"
          defaultValue=""
          options={["Online", "Offline", "Hybrid"]}
        />

        <FloatingInput
          label="Location"
          name="address"
          defaultValue=""
          autoComplete="address-level1"
        />
        <FloatingInput
          label="Time Zone (e.g. Asia/Dhaka)"
          name="timezone"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Swap Preference"
          name="preference"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Portfolio Link"
          name="website"
          defaultValue=""
          autoComplete="url"
          className="col-span-2"
        />
        <FloatingInput
          label="Languages (comma separated)"
          name="languages"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Tags (comma separated)"
          name="tags"
          defaultValue=""
          className="col-span-2"
        />
        <FloatingInput
          label="Response Time (e.g. Within 24 hours)"
          name="response_time"
          defaultValue=""
          className="col-span-2"
        />

        <FloatingInput
          label="Email Address"
          type="email"
          name="email"
          defaultValue=""
          autoComplete="email"
        />
        <FloatingInput
          label="Phone Number"
          name="tel"
          defaultValue=""
          autoComplete="tel"
        />
        <FloatingInput
          label="Facebook Link"
          name="facebook_url"
          defaultValue=""
          autoComplete="url"
          className="col-span-2"
        />
        <FloatingInput
          label="Instagram Link"
          name="instagram_url"
          defaultValue=""
          autoComplete="url"
        />
        <FloatingInput
          label="Twitter Link"
          name="twitter_url"
          defaultValue=""
          autoComplete="url"
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
