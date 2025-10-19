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
        "Curated sections and subtopics so learners follow a clear path no guesswork.",
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
      color:
        "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500",
      textColor: "text-blue-700 dark:text-blue-400",
      descColor: "text-blue-950/80 dark:text-blue-200",
    },
    {
      name: "Group Learning",
      description:
        "Collaborative group sessions study together, share resources, co-learn.",
      icon: Users,
      color:
        "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500",
      textColor: "text-green-700 dark:text-green-400",
      descColor: "text-green-950/80 dark:text-green-200",
    },
    {
      name: "Enterprise Toolkit",
      description:
        "Team management, usage analytics and single-sign-on for organizations.",
      icon: Building2,
      color:
        "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500",
      textColor: "text-purple-700 dark:text-purple-400",
      descColor: "text-purple-950/80 dark:text-purple-200",
    },
  ];

  return (
    <div className="bg-base-100 dark:bg-base-100 min-h-screen text-base-content dark:text-base-content flex flex-col mt-10">
      <NavbarPage />
      {/* Header */}

      <div className="py-16 text-center mb-4">

        <h2 className="text-4xl font-bold">Featured What sets us apart</h2>
        <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
          A single-section summary of the unique tools inside{" "}
          <strong>Service Skills</strong>. Each card mirrors the look-and-feel
          of the Pricing layout so the presentation stays consistent across
          pages.
        </p>
      </div>

      <Container className="flex-grow">
        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <article
                key={idx}
                className="bg-base-200 border border-base-300 rounded-lg p-6 flex flex-col hover:border-red-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center">
                    <Icon size={30} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{f.name}</h3>
                    <p className="text-sm text-base-content/70 mt-1">
                      {f.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-base-300 dark:border-base-300 my-8" />

        {/* Upcoming Features */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold">Upcoming</h3>
          <p className="text-base-content/70 mt-2 max-w-3xl mx-auto">
            Planned improvements and premium capabilities we will ship soon
            great for presentation and roadmap conversations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {upcoming.map((u, i) => {
            const Icon = u.icon;
            return (
              <div
                key={i}
                className={`${u.color} border rounded-lg p-6 transition-colors`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-md ${
                      u.color.split(" ")[0]
                    } flex items-center justify-center`}
                  >
                    <Icon size={20} className={u.textColor} />
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