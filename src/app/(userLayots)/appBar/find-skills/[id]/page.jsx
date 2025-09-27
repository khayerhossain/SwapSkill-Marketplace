"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 border ${
            isToday(day)
              ? "bg-primary text-primary-content font-bold border-primary shadow-lg shadow-primary/20"
              : "hover:bg-primary/10 border-transparent hover:border-primary/30 text-base-content"
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-base-content">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-3 border border-base-300 hover:border-primary rounded-xl transition-all duration-300 hover:bg-primary/10 group"
          >
            <svg
              className="w-5 h-5 text-base-content/70 group-hover:text-primary transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-3 border border-base-300 hover:border-primary rounded-xl transition-all duration-300 hover:bg-primary/10 group"
          >
            <svg
              className="w-5 h-5 text-base-content/70 group-hover:text-primary transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-semibold text-base-content/60 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
    </div>
  );
}

export default function SkillDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        if (!id) return;
        const { data } = await axiosInstance.get(`/find-skills/${id}`);
        setSkill(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-red-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!skill)
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center bg-base-100 p-12 rounded-2xl border border-base-300 shadow-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="relative bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Profile Image and Status */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-base-100">
                  <img
                    src={skill.userImage || "https://via.placeholder.com/300"}
                    alt={skill.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
               
              </div>

              {/* Rating Card */}
              <div className="bg-base-100 text-base-content p-6 rounded-xl shadow-xl w-full max-w-sm border border-base-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-6 h-6 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-2xl font-bold">{skill.rating}</span>
                  </div>
                  <span className="text-sm opacity-80">
                    ({skill.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-base-content mb-4 leading-tight">
                  {skill.userName}
                </h1>
                <p className="text-2xl text-base-content/70 font-medium mb-6">
                  {skill.studyOrWorking}
                </p>

                {/* Location */}
                <div className="flex items-center space-x-3 text-base-content/70 mb-8">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-xl font-medium">{skill.location}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-base-content uppercase tracking-wider">
                  Primary Skill
                </h3>
                <div className="inline-block">
                  <span className="bg-primary text-primary-content px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:opacity-90 transition-colors duration-300">
                    {skill.skillName}
                  </span>
                </div>
              </div>

              {/* Additional Tags */}
              {skill.tags && skill.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-base-content uppercase tracking-wider">
                    Expertise Areas
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skill.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className="border border-base-300 text-base-content px-4 py-2 rounded-lg font-medium hover:bg-base-200/60 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Section */}
            <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-base-content uppercase tracking-wide">
                  About Me
                </h2>
              </div>
              <p className="text-lg text-base-content/80 leading-relaxed font-medium">
                {skill.description}
              </p>
            </div>

            {/* Calendar Section */}
            <Calendar />

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-black mb-2">
                  {skill.experience}
                </div>
                <div className="text-red-100 font-medium uppercase tracking-wide">
                  Experience
                </div>
              </div>
              {/* Availability Card */}
              <div className="bg-base-100 text-base-content p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-base-300">
                <div className="text-3xl font-black mb-2">
                  {skill.availability}
                </div>
                <div className="text-gray-300 dark:text-gray-700 font-medium uppercase tracking-wide">
                  Availability
                </div>
              </div>
              <div className="bg-base-100 border border-base-300 text-base-content p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-black mb-2">
                  {skill.availabilityType}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide">
                  Type
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Social */}
          <div className="lg:col-span-4 space-y-8">
            {/* Contact Card */}
            <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">
                  Contact
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 dark:hover:border-red-600 transition-colors duration-300 group">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MdEmail size={20} className="text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 truncate">
                    {skill.contactInfo.email}
                  </span>
                </div>

                <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 dark:hover:border-red-600 transition-colors duration-300 group">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-white dark:text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {skill.contactInfo.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">
                  Social
                </h3>
              </div>

              <div className="space-y-4">
                {skill.socialMedia.facebook && (
                  <a
                    href={skill.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 border border-base-300 rounded-xl hover:bg-base-200/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaFacebook size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-lg">Facebook</span>
                  </a>
                )}

                {skill.socialMedia.instagram && (
                  <a
                    href={skill.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 border border-base-300 rounded-xl hover:bg-base-200/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323a4.92 4.92 0 00-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <span className="font-bold text-lg">Instagram</span>
                  </a>
                )}

                {skill.socialMedia.twitter && (
                  <a
                    href={skill.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 border border-base-300 rounded-xl hover:bg-base-200/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <span className="font-bold text-lg">Twitter</span>
                  </a>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-red-600 text-white p-8 rounded-2xl shadow-xl text-center hover:bg-red-700 transition-colors duration-300">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-wide">
                Ready to Connect?
              </h3>
              <p className="text-red-100 mb-6">
                Let's discuss your project and bring your ideas to life.
              </p>
              <button className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors duration-300 w-full">
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
