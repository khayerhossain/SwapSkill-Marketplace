"use client";
import React from 'react';


const PopularSkills = () => {

  const skillsData = [
    {
      "id": 1,
      "title": "Coding",
      "description": "Develop software, algorithms, and apps. Solve complex logic problems.",
      "price": 40.00,
      "image": "https://i.ibb.co.com/PzTQG1wd/images.jpg"
    },
    {
      "id": 2,
      "title": "Running",
      "description": "Improve endurance, cardiovascular health. Track distance and speed.",
      "price": 30.00,
      "image": "https://i.ibb.co.com/PzTQG1wd/images.jpg"
    },
    {
      "id": 3,
      "title": "Swimming",
      "description": "Full-body exercise, build strength, relax mind. Learn different strokes.",
      "price": 35.00,
      "image": "https://i.ibb.co.com/PzTQG1wd/images.jpg"
    },
    {
      "id": 4,
      "title": "Writing",
      "description": "Create stories, articles, reports, expert, poetry. Express ideas clearly.",
      "price": 25.00,
      "image": "https://i.ibb.co.com/PzTQG1wd/images.jpg"
    }
  ];

  return (
      <div className="max-w-6xl mx-auto px-6 py-16 bg-gray-50">
        <h2
          className="text-3xl font-bold mb-10"          
        >
          Popular
        </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {skillsData.map((skill) => (
          <div key={skill.id} className="relative bg-white rounded-lg p-4 shadow-sm">
            
            {/* Right Side Image - Outside card, bigger size */}
            <div className="absolute -top-6 -right-6">
              <img 
                src={skill.image} 
                alt={skill.title}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Left Side Content */}
            <div className=" flex flex-col justify-start">
              {/* Title - Aligned with center of image */}
              <div className="flex items-center mb-20 ">
                <h3 className="text-lg font-semibold text-gray-900   ">
                  {skill.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {skill.description}
              </p>
              
              {/* Price and Add Button */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-semibold text-gray-900">
                  ${skill.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => console.log(`Added ${skill.title} to cart`)}
                  className="bg-purple-100 border border-purple-300 text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>

  );
};

export default PopularSkills;