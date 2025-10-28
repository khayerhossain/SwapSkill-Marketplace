"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Loading from "@/app/loading";
import axiosInstance from "@/lib/axiosInstance";

export default function InboxLayout({ children }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);

      const isChatPage = pathname.includes("/chat/");
      setShowChat(isChatPage && mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [pathname]);

  useEffect(() => {
    if (session?.user?.id) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      await axiosInstance.get(`/chats?userId=${session.user.id}`);
      const skillsResponse = await axiosInstance.get("/find-skills?limit=50");
      const skillsData = skillsResponse.data;
      if (skillsData.success) setSkills(skillsData.skills || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = async (skill) => {
    try {
      const response = await axiosInstance.post("/chats", {
        skillId: skill._id,
        skillOwnerId: skill.userId,
        selectedDate: new Date().toISOString(),
      });

      const chatData = response.data;

      if (chatData.success) {
        const chatUrl = `/appBar/inbox/chat/${chatData.chatId}`;
        if (isMobileView) {
          setShowChat(true);
          router.push(chatUrl);
        } else {
          router.push(chatUrl);
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Error starting chat. Please try again.");
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Loading />
      </div>
    );
  }

  if (isMobileView && showChat) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-black/60 text-white">
      {/* Left Sidebar (Skills List) */}
      <div
        className={`${
          isMobileView
            ? showChat
              ? "hidden"
              : "w-full"
            : "w-1/2 p-6 border-r border-white/10"
        } backdrop-blur-xl bg-white/5`}
      >
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Chats</h1>
          <p className="text-gray-400 text-sm">
            Manage your conversations and discover new skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 shadow-xl">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search chats or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-gray-200 placeholder-gray-500 pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Skills List */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg max-h-[70vh] overflow-y-auto scrollbar-hide">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div
                key={skill._id}
                onClick={() => handleSkillClick(skill)}
                className="flex items-center gap-4 p-4 mb-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] cursor-pointer transition-all duration-300"
              >
                <img
                  src={
                    skill.userImage ||
                    `https://ui-avatars.com/api/?name=${skill.userName}&background=222&color=fff`
                  }
                  alt={skill.userName}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {skill.userName}
                  </h3>
                  <p className="text-sm text-gray-400">{skill.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {skill.description || "No description available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6 italic">
              No skills found.
            </p>
          )}
        </div>
      </div>

      {/* Right Chat Section */}
      <div
        className={`${
          isMobileView && !showChat ? "hidden" : "w-1/2"
        } backdrop-blur-xl bg-white/5`}
      >
        {children}
      </div>
    </div>
  );
}
