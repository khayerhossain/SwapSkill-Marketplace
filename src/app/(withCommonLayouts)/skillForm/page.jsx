"use client";
import { useState } from "react";

export default function SkillForm() {
  const [formData, setFormData] = useState({
    userName: "",
    category: "",
    description: "",
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message || "Something went wrong!");
    setFormData({ userName: "", category: "", description: "" });
  };

  return (
    <section className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Add Your Skill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userName"
          placeholder="Your Name"
          value={formData.userName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
