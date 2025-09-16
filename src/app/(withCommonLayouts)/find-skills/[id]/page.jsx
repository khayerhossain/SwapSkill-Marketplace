 "use client";

import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function SkillDetailsPage({ params }) {
  const { id } = params;
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await fetch(`/api/find-skills/${id}`);
        const data = await res.json();
        setSkill(data);
      } catch (err) {
        console.error("Error fetching skill:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id]);

  if (loading)
    return <div className="text-center mt-20 text-lg font-medium">Loading...</div>;

  if (!skill)
    return (
      <div className="text-center mt-20 text-red-500 font-medium">
        Skill not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Side - Main Content */}
      <div className="md:col-span-2 space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow">
          <img
            src={skill.userImage || "https://via.placeholder.com/150"}
            alt={skill.userName}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{skill.userName}</h1>
            <p className="text-gray-500 mt-1">{skill.studyOrWorking}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <FaStar className="text-yellow-400" />
              <span className="font-medium">{skill.rating} / 5</span>
              <span className="text-gray-500">({skill.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Skills & Highlights</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {skill.skillName}
            </span>
            {skill?.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Profile Description</h2>
          <p className="text-gray-700 leading-relaxed">{skill.description}</p>
        </div>

        {/* Extra Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center gap-2">
            <FaClock className="text-indigo-500" />{" "}
            <span className="font-semibold">Availability:</span>{" "}
            {skill.availability} ({skill.availabilityType})
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />{" "}
            <span className="font-semibold">Location:</span> {skill.location}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />{" "}
            <span className="font-semibold">Email:</span>{" "}
            {skill?.contactInfo?.email}
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-green-500" />{" "}
            <span className="font-semibold">Phone:</span>{" "}
            {skill?.contactInfo?.phone}
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Connect with {skill.userName}
          </h2>
          <div className="flex gap-5 text-2xl">
            {skill?.socialMedia?.facebook && (
              <a
                href={skill.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:scale-110 transition-transform"
              >
                <FaFacebook />
              </a>
            )}
            {skill?.socialMedia?.instagram && (
              <a
                href={skill.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
            )}
            {skill?.socialMedia?.twitter && (
              <a
                href={skill.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:scale-110 transition-transform"
              >
                <FaTwitter />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Action Card */}
      <div>
        <div className="p-6 bg-white shadow-lg rounded-2xl sticky top-20">
          <h3 className="text-xl font-bold mb-4">Swap Details</h3>
          <p className="mb-2">
            <span className="font-semibold">Experience:</span>{" "}
            {skill.experience}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Duration:</span>{" "}
            {skill.duration || "Not specified"}
          </p>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
            Request Swap
          </button>
        </div>
      </div>
    </div>
  );
}


  
