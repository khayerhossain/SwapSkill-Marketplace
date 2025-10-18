"use client";

import Container from "@/components/shared/Container";
import {
  Check,
  BookOpen,
  Calendar,
  Award,
  Gamepad2,
  MessageCircle,
  CreditCard,
  Briefcase,
  BarChart3,
  Sparkles,
  Users,
  Building2,
} from "lucide-react";
import NavbarPage from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Featured() {
  const features = [
    {
      name: "Structured Skill Categories",
      description:
        "Curated sections and subtopics so learners follow a clear path — no guesswork.",
      icon: BookOpen,
    },
    {
      name: "Booking & Scheduling",
      description:
        "One-click bookings, calendar sync, and automatic reminders to keep sessions on track.",
      icon: Calendar,
    },
    {
      name: "Verified Tutor Badge",
      description:
        "Category tests and verifications to help top tutors stand out and earn trust.",
      icon: Award,
    },
    {
      name: "Gamified Progress",
      description:
        "Quizzes, points and leaderboards that increase retention and motivate regular learning.",
      icon: Gamepad2,
    },
    {
      name: "Community & Real-time Chat",
      description:
        "Discussion rooms, threaded conversations and instant messaging for better collaboration.",
      icon: MessageCircle,
    },
    {
      name: "Secure Payments & History",
      description:
        "Transparent transactions with receipts and an easy refund / dispute flow for peace of mind.",
      icon: CreditCard,
    },
    {
      name: "Tutor Tools",
      description:
        "Scheduling dashboard, session reports and earnings overview for professional tutors.",
      icon: Briefcase,
    },
    {
      name: "Learner Dashboard",
      description:
        "Personalized progress tracker, saved courses and quick access to booked sessions.",
      icon: BarChart3,
    },
  ];

  const upcoming = [
    {
      name: "AI Recommendations",
      description:
        "Personalized learning paths & skill recommendations powered by AI (coming soon).",
      icon: Sparkles,
      color: "bg-red-600/10 border-red-500/30 hover:bg-red-500/20",
      textColor: "text-red-500",
      descColor: "text-gray-200/80",
    },
    {
      name: "Group Learning",
      description:
        "Collaborative group sessions — study together, share resources, co-learn.",
      icon: Users,
      color: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20",
      textColor: "text-green-400",
      descColor: "text-gray-200/80",
    },
    {
      name: "Enterprise Toolkit",
      description:
        "Team management, usage analytics and single-sign-on for organizations.",
      icon: Building2,
      color: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20",
      textColor: "text-purple-400",
      descColor: "text-gray-200/80",
    },
  ];

  return (
    <div className="bg-[#111111] min-h-screen text-gray-200 flex flex-col">
      <NavbarPage />

      {/* Header */}
      <div className="py-16 text-center px-4 md:px-0 mt-10">
        <h2 className="text-4xl  font-bold text-white mb-4">
          <span className="text-red-500">Featured</span> What Sets Us Apart
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          A single-section summary of the unique tools inside{" "}
          <strong className="text-red-500">SwapSkill</strong>. Each card mirrors
          the look-and-feel of the Pricing layout so the presentation stays
          consistent across pages.
        </p>
      </div>

      <Container className="flex-grow">
        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <article
                key={idx}
                className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 flex flex-col gap-3 hover:shadow-lg hover:border-red-500 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-red-500/20 flex items-center justify-center">
                    <Icon size={28} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{f.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {f.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-800 my-8" />

        {/* Upcoming Features */}
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-red-500 mb-2">Upcoming</h3>
          <p className="text-gray-400 max-w-3xl mx-auto text-base leading-relaxed">
            Planned improvements and premium capabilities we will ship soon —
            great for presentation and roadmap conversations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-28">
          {upcoming.map((u, i) => {
            const Icon = u.icon;
            return (
              <div
                key={i}
                className={`${u.color} border rounded-xl p-6 transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-opacity-20">
                    <Icon size={24} className={u.textColor} />
                  </div>
                  <h4 className={`font-semibold text-lg ${u.textColor}`}>
                    {u.name}
                  </h4>
                </div>
                <p className={`text-sm ${u.descColor} mt-2`}>{u.description}</p>
              </div>
            );
          })}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
