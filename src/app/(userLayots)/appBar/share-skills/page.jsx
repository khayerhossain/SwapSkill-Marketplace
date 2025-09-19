// "use client";
// import { useState } from "react";

// export default function SkillForm() {
//   const [formData, setFormData] = useState({
//     userName: "",
//     category: "",
//     description: "",
//     skills: "",
//     experience: "",
//     date: "",
//     location: "",
//     rating: "",
//     imageUrl: "",
//     gender: "",

//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/skills", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();
//     alert(data.message || "Something went wrong!");
//     setFormData({ userName: "", category: "", description: "",experience: "",date: "",location: "",rating: "",gender: "",imageUrl: "" });
//   };

//   return (
//     <section className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
//       <h2 className="text-2xl font-bold mb-4">Add Your Skill</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* {Name} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">
//           Your Name
//         </label>
//         <input
//           type="text"
//           name="userName"
//           placeholder="Your Name"
//           value={formData.userName}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         {/* {category} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">
//         Category
//         </label>
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select category</option>
//           <option value="Fresher">Programming</option>
//           <option value="1 Year">Design</option>
//           <option value="2 Years">Marketing</option>
//           <option value="3 Years">UI/UX</option>

//         </select>

//         {/* {description} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">
//           description
//         </label>
//         <textarea
//           name="description"
//           placeholder="Short Description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         {/* {Gender} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">Gender</label>
//         <select
//           name="gender"
//           value={formData.gender} // make sure to add 'gender' in your formData state
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         {/* {rating} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">Rating</label>
//         <input
//           name="rating"
//           placeholder="Rating"
//           value={formData.rating}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         {/* {skills} */}

//         <label className="text-xl mb-1 font-medium text-gray-700">Skills</label>
//         <select
//           name="skills"
//           value={formData.skills}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Skills</option>
//           <option value="Fresher">Html5</option>
//           <option value="1 Year">CSS3</option>
//           <option value="2 Years">React</option>
//           <option value="3 Years">Javascript</option>
//           <option value="4 Years">Next.js</option>
//           <option value="5+ Years">TypeScript</option>
//         </select>
//         {/* {experience} */}

//         <label className="text-xl mb-1 font-medium text-gray-700">
//           Experience
//         </label>
//         <select
//           name="experience"
//           value={formData.experience}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Experience</option>
//           <option value="Fresher">Fresher</option>
//           <option value="1 Year">1 Year</option>
//           <option value="2 Years">2 Years</option>
//           <option value="3 Years">3 Years</option>
//           <option value="4 Years">4 Years</option>
//           <option value="5+ Years">5+ Years</option>
//         </select>
//         {/* {Date} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">Date</label>
//         <select
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Date</option>
//           <option value="weekends(sat-sun)">weekends(sat-sun)</option>
//           <option value="weekends(sun-wed)">weekends(sun-wed)</option>
//           <option value="weekends(fri-mon)">weekends(fri-mon)</option>
//           <option value="weekends(Thu-sun)">weekends(Thu-sun)</option>
//         </select>

//         {/* {Location} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">
//           Location
//         </label>
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         {/* {image Url} */}
//         <label className="text-xl mb-1 font-medium text-gray-700">
//           Image Url
//         </label>
//         <input
//           type="text"
//           name="imageUrl"
//           placeholder="imageUrl"
//           value={formData.imageUrl}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"

//         />

//         <button
//           type="submit"
//           className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
//         >
//           Submit
//         </button>
//       </form>
//     </section>
//   );
// }
"use client";
import { useState } from "react";
import Swal from "sweetalert2";

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
   if (res.ok) {
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
         //  Go to quiz page
         window.location.href = "/community";
       } else if (result.isDismissed) {
         //  Go to find page
         window.location.href = "/find-skills";
       }
     });
   } else {
     Swal.fire("Error!", "Something went wrong.", "error");
   }
    // alert(data.message || "Something went wrong!");
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
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            {/* <option value="">Select category</option>
            <option value="Fresher">Programming</option>
            <option value="1 Year">Design</option>
            <option value="2 Years">Marketing</option>
            <option value="3 Years">UI/UX</option> */}
          </input>
        </div>
        {/* {studyOrWorking} */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Study Or Working
          </label>
          <input
            type="text"
            name="studyOrWorking"
            placeholder="study Or Working"
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
          <input
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Skills
          </label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            {/* <option value="">Select Skills</option>
            <option value="Fresher">Html5</option>
            <option value="1 Year">CSS3</option>
            <option value="2 Years">React</option>
            <option value="3 Years">Javascript</option>
            <option value="4 Years">Next.js</option>
            <option value="5+ Years">TypeScript</option> */}
          </input>
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
           
            <option value="4 Years">less than 1 years</option>
            <option value="Fresher">Fresher</option>
            <option value="1 Year">1-2 Year</option>
            <option value="2 Years">3-4 Years</option>

            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Date
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          >
            <option value="">Select Date</option>
            <option value="weekends(sat-sun)">weekends(sat-sun)</option>
            <option value="weekends(sun-wed)">weekends(sun-wed)</option>
            <option value="weekends(fri-mon)">weekends(fri-mon)</option>
            <option value="weekends(Thu-sun)">weekends(Thu-sun)</option>
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
