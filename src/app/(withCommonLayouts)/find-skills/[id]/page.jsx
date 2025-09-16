 "use client";

import React, { use, useEffect, useState } from "react";

export default function SkillDetailsPage({ params }) {
  const { id } =use(params);
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

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!skill) return <div className="text-center mt-20">Skill not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <img
          src={skill.userImage || "https://via.placeholder.com/150"}
          alt={skill.userName}
          className="w-32 h-32 rounded-full object-cover shadow-md"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{skill.userName}</h1>
          <p className="text-gray-600 mt-1">{skill.studyOrWorking}</p>
        </div>
      </div>

      {/* Skills & Highlights */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Skills & Highlights</h2>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{skill.skillName}</span>
          {skill.tags.map((tag) => (
            <span key={tag} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Detailed Info */}
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-semibold">Profile Description</h2>
        <p className="text-gray-700">{skill.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Experience:</span> {skill.experience}</p>
          <p><span className="font-semibold">Availability:</span> {skill.availability} ({skill.availabilityType})</p>
          <p><span className="font-semibold">Location:</span> {skill.location}</p>
          <p><span className="font-semibold">Rating:</span> {skill.rating} ({skill.reviewsCount} reviews)</p>
          <p><span className="font-semibold">Email:</span> {skill.contactInfo.email}</p>
          <p><span className="font-semibold">Phone:</span> {skill.contactInfo.phone}</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
        <div className="flex gap-4">
          {skill.socialMedia.facebook && (
            <a href={skill.socialMedia.facebook} target="_blank" className="text-blue-600 hover:underline">Facebook</a>
          )}
          {skill.socialMedia.instagram && (
            <a href={skill.socialMedia.instagram} target="_blank" className="text-pink-600 hover:underline">Instagram</a>
          )}
          {skill.socialMedia.twitter && (
            <a href={skill.socialMedia.twitter} target="_blank" className="text-blue-400 hover:underline">Twitter</a>
          )}
        </div>
      </div>
    </div>
  );
}


  
