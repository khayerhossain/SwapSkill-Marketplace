"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { useSession } from "next-auth/react";

// Helper components moved outside SkillForm to prevent re-creation on render
const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  className = "",
  autoComplete,
  ...props
}) => (
  <div className={`relative ${className}`}>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="peer w-full p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
      placeholder={label}
      {...props}
    />
    <label
      htmlFor={name}
      className="absolute left-3 -top-2.5 bg-transparent px-1 text-sm text-gray-300 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 
      peer-placeholder-shown:text-base peer-focus:-top-2.5 
      peer-focus:text-sm peer-focus:text-white"
    >
      {label}
    </label>
  </div>
);

const FloatingTextarea = ({ label, name, defaultValue, className = "" }) => (
  <div className={`relative ${className}`}>
    <textarea
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="peer w-full p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/50 resize-none h-32 lg:h-[200px]"
      placeholder={label}
    />
    <label
      htmlFor={name}
      className="absolute left-3 -top-2.5 bg-transparent px-1 text-sm text-gray-300 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 
      peer-placeholder-shown:text-base peer-focus:-top-2.5 
      peer-focus:text-sm peer-focus:text-white"
    >
      {label}
    </label>
  </div>
);

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
      className="peer w-full p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      <option value="" disabled hidden></option>
      {options.map((opt, i) => (
        <option key={i} value={opt} className="bg-black text-white">
          {opt}
        </option>
      ))}
    </select>
    <label
      htmlFor={name}
      className="absolute left-3 -top-2.5 px-1 text-sm text-gray-300"
    >
      {label}
    </label>
  </div>
);

// Main component
export default function SkillForm() {
  const { data: session } = useSession();
  const [userImageData, setUserImageData] = useState("");
  const [audio, setAudio] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [dateInput, setDateInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio("/sounds/notification.mp3"));
    }
  }, []);

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

  const addDate = () => {
    if (dateInput && !availabilityDates.includes(dateInput)) {
      setAvailabilityDates([...availabilityDates, dateInput]);
      setDateInput("");
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);
      const get = (name) => (fd.get(name) || "").toString();

      const payload = {
        userName: get("name"),
        age: get("age"),
        gender: get("gender"),
        homeTown: get("city"),
        studyOrWorking: get("study_or_work"),
        userImage: userImageData,
        category: get("category"),
        description: get("description"),
        experience: get("experience"),
        availabilityType: get("availability_type"),
        location: get("address"),
        timeZone: get("timezone"),
        skillsToTeach: get("skills_teach"),
        skillsToLearn: get("skills_learn"),
        swapPreference: get("preference"),
        portfolioLink: get("website"),
        languages: get("languages"),
        responseTime: get("response_time"),
        phone: get("tel"),
        facebook: get("facebook_url"),
        instagram: get("instagram_url"),
        twitter: get("twitter_url"),
        availabilityDates,
        tags,
        email: session?.user?.email || null,
      };

      const { data } = await axiosInstance.post("/skills", payload);

      if (data?.success) {
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
        setAvailabilityDates([]);
        setTags([]);
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
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 flex items-center justify-center ">
      <div className="w-full max-w-6xl p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-white text-left ">
          Share Your Skills
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <FloatingInput label="Full Name" name="name" required />
          <FloatingInput label="Age" type="number" name="age" />

          <FloatingSelect
            label="Gender"
            name="gender"
            options={["Male", "Female", "Other"]}
          />

          <FloatingInput label="Home Town" name="city" />
          <FloatingInput
            label="Study or Working"
            name="study_or_work"
            className="col-span-2"
          />

          {/* Image + Description */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            <div className="md:col-span-1 flex flex-col items-center border-2 border-dashed border-white/30 p-4 rounded-lg bg-white/5">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center border border-white/20 rounded-lg mb-2">
                  <span className="text-gray-400 text-xs text-center">
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
                className="px-3 py-1 bg-white/20 text-white text-sm rounded-lg cursor-pointer hover:bg-white/40 transition"
              >
                Choose
              </label>
            </div>

            <FloatingTextarea
              label="Description"
              name="description"
              className="md:col-span-4"
            />
          </div>

          <FloatingSelect
            label="Skill Category"
            name="category"
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
            label="Skills to Teach"
            name="skills_teach"
            className="col-span-2"
          />
          <FloatingInput
            label="Skills to Learn"
            name="skills_learn"
            className="col-span-2"
          />
          <FloatingInput label="Experience" name="experience" />
          <FloatingInput label="Availability" name="availability" />

          <FloatingSelect
            label="Availability Type"
            name="availability_type"
            options={["Online", "Offline", "Hybrid"]}
          />

          <FloatingInput label="Location" name="address" />
          <FloatingInput
            label="Time Zone"
            name="timezone"
            className="col-span-2"
          />
          <FloatingInput
            label="Swap Preference"
            name="preference"
            className="col-span-2"
          />
          <FloatingInput
            label="Portfolio Link"
            name="website"
            className="col-span-2"
          />
          <FloatingInput
            label="Languages"
            name="languages"
            className="col-span-2"
          />

          {/* Tags */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Tags
            </label>
            <div className="flex gap-2">
              <FloatingInput
                type="text"
                name="tag_input" // Added name for clarity, though not strictly needed by FormData
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                className="flex-1"
                label="Enter tag" // Pass label for floating effect
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/40 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/20 text-white px-2 py-1 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <FloatingInput
            label="Response Time"
            name="response_time"
            className="col-span-2"
          />
          <FloatingInput label="Phone Number" name="tel" />
          <FloatingInput
            label="Facebook Link"
            name="facebook_url"
            className="col-span-2"
          />
          <FloatingInput label="Instagram Link" name="instagram_url" />
          <FloatingInput label="Twitter Link" name="twitter_url" />

          {/* Availability Dates */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Availability Dates
            </label>
            <div className="flex gap-2">
              <FloatingInput
                type="date"
                name="date_input" // Added name for clarity
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="flex-1"
                label="Select date" // Pass label for floating effect
              />
              <button
                type="button"
                onClick={addDate}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/40 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {availabilityDates.map((d, i) => (
                <span
                  key={i}
                  className="bg-white/20 text-white px-2 py-1 rounded-lg"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="col-span-2 py-3 bg-red-500 text-white font-bold rounded-lg cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}