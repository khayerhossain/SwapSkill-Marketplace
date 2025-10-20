"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaTwitter, FaStar } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

/* ---------------- Skeleton Loader ---------------- */
function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-[#111111] border border-gray-800 rounded-2xl p-6 ${className}`}
    >
      <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */
function NeonBadge({ online }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
        online
          ? "bg-gradient-to-r from-green-400/15 to-green-200/10 text-green-300"
          : "bg-gray-800 text-gray-400"
      }`}
      style={online ? { boxShadow: "0 6px 18px rgba(34,197,94,0.06)" } : {}}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          online ? "bg-green-400/90" : "bg-gray-600"
        }`}
        style={online ? { boxShadow: "0 0 8px rgba(34,197,94,0.9)" } : {}}
      />
      {online ? "Online" : "Offline"}
    </span>
  );
}

/* ---------------- Stat Chip ---------------- */
function StatChip({ label, value, accent = "text-blue-400", icon = null }) {
  return (
    <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.02)] border border-gray-800 px-4 py-2 rounded-xl flex-1 min-w-[100px] justify-center sm:justify-start">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#0ea5e9]/20 to-[#7c3aed]/10">
        {icon}
      </div>
      <div className="text-center sm:text-left">
        <div className={`font-bold ${accent}`}>{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

/* ---------------- Compact Neon Calendar ---------------- */
function Calendar({ onDateSelect, availableDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();

  const monthShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const formatStr = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isAvailable = (day, month, year) =>
    availableDates.includes(formatStr(year, month, day));

  const handleClick = (day) => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    if (isAvailable(day, m, y)) {
      const dt = new Date(y, m, day);
      setSelectedDate(dt);
      onDateSelect?.(dt);
    }
  };

  const prev = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const next = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const renderDays = () => {
    const nodes = [];
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    for (let i = 0; i < firstDay; i++)
      nodes.push(<div key={`e-${i}`} className="h-8 w-8"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const avail = isAvailable(d, m, y);
      const sel =
        selectedDate &&
        selectedDate.getDate() === d &&
        selectedDate.getMonth() === m &&
        selectedDate.getFullYear() === y;
      const todayFlag =
        today.getDate() === d &&
        today.getMonth() === m &&
        today.getFullYear() === y;

      nodes.push(
        <button
          key={d}
          onClick={() => avail && handleClick(d)}
          className={`h-8 w-8 flex items-center justify-center rounded-md text-xs transition-all duration-200
            ${
              sel
                ? "bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] shadow-[0_6px_18px_rgba(0,229,255,0.08)]"
                : avail
                ? "bg-[rgba(14,165,233,0.08)] text-blue-300 hover:scale-105 cursor-pointer"
                : "text-gray-600/80 cursor-not-allowed"
            }`}
          aria-pressed={sel}
        >
          {d}
        </button>
      );
    }
    return nodes;
  };

  return (
    <div className="bg-[linear-gradient(180deg,#0b0b0b,rgba(9,9,14,0.6))] border border-gray-800 rounded-2xl p-4 shadow-[0_8px_30px_rgba(124,58,237,0.06)] w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-400">
            {monthShort[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div className="text-sm font-semibold text-white">
            {currentDate.toLocaleString("default", { month: "long" })}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="text-gray-300 bg-transparent px-2 py-1 rounded-md hover:bg-gray-800/50"
          >
            &larr;
          </button>
          <button
            onClick={next}
            className="text-gray-300 bg-transparent px-2 py-1 rounded-md hover:bg-gray-800/50"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {renderDays()}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-400/60" />
        <span>Available</span>
        <span className="ml-3 inline-block w-2 h-2 rounded-full bg-[#00E5FF]/30 border border-[#00E5FF]" />
        <span>Selected</span>
      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function SkillDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/find-skills/${id}`);
        setSkill(data);
      } catch (err) {
        console.error("Fetch skill error:", err);
        setSkill(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSkill();
  }, [id]);

  const handleDateSelect = (date) => setSelectedDate(date);

  const handleConnectClick = async () => {
    if (!selectedDate) return alert("Please select an available date first.");
    if (!skill) return;

    setStartingChat(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: id,
          skillOwnerId: skill.userId,
          selectedDate: selectedDate.toISOString(),
        }),
      });
      const result = await res.json();
      if (result.success) {
        router.push(`/appBar/inbox/chat/${result.chatId}`);
      } else {
        alert(result.message || "Could not start chat.");
      }
    } catch (err) {
      console.error("Start chat error:", err);
      alert("Something went wrong while starting chat.");
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <div className="space-y-4">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-gray-400">
            This profile may have been removed or the ID is invalid.
          </p>
        </div>
      </div>
    );
  }

  const availableDates = skill.availabilityDates || [];
  const online = skill.isOnline ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050508] to-[#0b0b0f] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---------- LEFT - Profile ---------- */}
        <div className="space-y-8">
          {/* --- Top Section: Profile + Main Info --- */}
          <div className="grid lg:grid-cols-2 gap-8 rounded-2xl border border-gray-800 p-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] shadow-[0_10px_40px_rgba(124,58,237,0.06)]">
            {/* Left: Profile Image */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-br from-[#00E5FF] to-[#7c3aed] shadow-[0_8px_30px_rgba(124,58,237,0.12)] mb-4">
                <img
                  src={skill.userImage || "https://via.placeholder.com/150"}
                  alt={skill.userName}
                  className="w-full h-full rounded-full object-cover border border-gray-900"
                />
              </div>
              <h1 className="text-2xl font-extrabold">{skill.userName}</h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                <MdLocationOn className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  {skill.location || "Unknown"}
                </span>
              </div>
              <div className="mt-2">
                <NeonBadge online={online} />
              </div>
            </div>

            {/* Right: Profile Details */}
            <div className="flex flex-col justify-center gap-4 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <StatChip
                  label="Rating"
                  value={`${skill.rating ?? "—"} ⭐`}
                  icon={<FaStar className="text-yellow-400" />}
                />
                <StatChip
                  label="Experience"
                  value={skill.experience || "—"}
                  icon={<div className="text-sm">🕒</div>}
                />
                <StatChip
                  label="Sessions"
                  value={skill.sessionsCount ?? 0}
                  icon={<div className="text-sm">📅</div>}
                />
              </div>

              <div>
                <h3 className="text-sm text-blue-300 font-semibold mb-1">
                  Primary Skill
                </h3>
                <div className="inline-block bg-[rgba(14,165,233,0.06)] border border-[#0ea5e9]/20 px-4 py-1 rounded-full text-sm text-blue-300 font-bold">
                  {skill.category}
                </div>
              </div>
            </div>
          </div>

          {/* --- Bottom Section: 4 Full-Width Rows --- */}
          <div className="w-full flex flex-col gap-6">
            {/* Expertise */}
            <div className="w-full rounded-2xl p-6 border border-gray-800 bg-[rgba(255,255,255,0.02)]">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skill.tags || []).map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] border border-gray-800 text-sm text-gray-300 hover:text-blue-300 transition"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="w-full rounded-2xl p-6 border border-gray-800 bg-[rgba(255,255,255,0.02)]">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                About
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {skill.description || "No description provided."}
              </p>
            </div>

            {/* Contact */}
            <div className="w-full rounded-2xl p-6 border border-gray-800 bg-[rgba(255,255,255,0.02)]">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                Contact
              </h3>
              <div className="flex flex-col gap-2 text-gray-300">
                <div className="flex items-center gap-2 break-all">
                  <MdEmail className="text-blue-300" />
                  {skill.contactInfo?.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 break-all">
                  <MdPhone className="text-blue-300" />
                  {skill.contactInfo?.phone || "N/A"}
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="w-full rounded-2xl p-6 border border-gray-800 bg-[rgba(255,255,255,0.02)]">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                Social
              </h3>
              <div className="flex gap-3">
                {skill.socialMedia?.facebook && (
                  <a
                    href={skill.socialMedia.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-[#1877F2] text-white"
                  >
                    <FaFacebook />
                  </a>
                )}
                {skill.socialMedia?.instagram && (
                  <a
                    href={skill.socialMedia.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"
                  >
                    <FaInstagram />
                  </a>
                )}
                {skill.socialMedia?.twitter && (
                  <a
                    href={skill.socialMedia.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-[#1DA1F2] text-white"
                  >
                    <FaTwitter />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- RIGHT - Calendar & CTA ---------- */}
        <div className="space-y-6">
          <div className="rounded-2xl p-4 border border-gray-800 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),transparent)]">
            <h3 className="text-sm text-gray-400 mb-3">Available Dates</h3>
            <Calendar
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>

          {/* Call to Action */}
          <div className="rounded-2xl p-4 border border-gray-800 bg-gradient-to-br from-[#0f1724] to-[#071022] shadow-[0_12px_40px_rgba(0,229,255,0.04)]">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 text-center sm:text-left">
              <div>
                <div className="text-xs text-gray-400">Selected Date</div>
                <div className="text-lg font-semibold">
                  {selectedDate
                    ? selectedDate.toDateString()
                    : "No date selected"}
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="text-xs text-gray-400">Duration</div>
                <div className="text-sm font-semibold">45 min</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">
                Notes for meeting
              </div>
              <textarea
                placeholder="Add a short message or goal for the mock interview (optional)"
                className="w-full min-h-[80px] rounded-md bg-transparent border border-gray-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 resize-none"
              />
            </div>

            <div className="mb-3 text-xs text-gray-400">Payment</div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-300">Session Fee</div>
                <div className="font-bold text-white">
                  ৳ {skill.fee ?? "Free"}
                </div>
              </div>
              <div className="text-sm text-gray-400">Refundable</div>
            </div>

            <button
              onClick={handleConnectClick}
              disabled={!selectedDate || startingChat}
              className={`w-full py-3 rounded-xl font-extrabold text-lg transition transform ${
                selectedDate
                  ? "bg-gradient-to-br from-[#00E5FF] to-[#7c3aed] text-black shadow-[0_12px_40px_rgba(124,58,237,0.18)] hover:scale-[1.02] animate-pulse-slow"
                  : "bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
            >
              {startingChat
                ? "Starting..."
                : selectedDate
                ? "Start Mock Interview"
                : "Select a Date"}
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center sm:text-left">
              By starting a session you agree to the platform terms.
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl p-4 border border-gray-800 bg-[rgba(255,255,255,0.01)] flex flex-wrap gap-3 justify-center sm:justify-between">
            <StatChip
              label="Success Rate"
              value={`${skill.successRate ?? 0}%`}
              icon={<div className="text-sm">🏆</div>}
            />
            <StatChip
              label="Avg Response"
              value={`${skill.avgResponseTime ?? "—"}h`}
              icon={<div className="text-sm">⚡</div>}
            />
            <StatChip
              label="Sessions"
              value={skill.sessionsCount ?? 0}
              icon={<div className="text-sm">📅</div>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}