"use client";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const SavedItems = () => {
  const savedSkills = [
    {
      id: 1,
      name: "Web Development",
      provider: "Kairo Hossain",
      location: "Sylhet, Bangladesh",
      rating: 4.9,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 2,
      name: "Graphic Design",
      provider: "Ayesha Rahman",
      location: "Dhaka, Bangladesh",
      rating: 4.7,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 3,
      name: "Digital Marketing",
      provider: "Sakib Hasan",
      location: "Chattogram, Bangladesh",
      rating: 4.8,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 4,
      name: "UI/UX Design",
      provider: "Nafisa Akter",
      location: "Rajshahi, Bangladesh",
      rating: 4.6,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 5,
      name: "Mobile App Development",
      provider: "Tahmid Islam",
      location: "Khulna, Bangladesh",
      rating: 4.9,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
    {
      id: 6,
      name: "Content Writing",
      provider: "Sumaiya Chowdhury",
      location: "Barishal, Bangladesh",
      rating: 4.5,
      image: "https://i.ibb.co.com/R42ZQRkn/coding-5-64.png",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">Saved Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-card border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={skill.image}
              alt={skill.name}
              width={500}
              height={300}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{skill.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                By {skill.provider}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                📍 {skill.location}
              </p>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-medium text-foreground">
                  {skill.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedItems;
