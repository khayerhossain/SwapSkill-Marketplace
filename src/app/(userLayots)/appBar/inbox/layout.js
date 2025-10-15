"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Clock, User, Star } from "lucide-react";
import Loading from "@/app/loading";

export default function InboxLayout({ children }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) loadData();
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      await fetch(`/api/chats?userId=${session.user.id}`);
      const skillsResponse = await fetch("/api/find-skills?limit=50");
      const skillsData = await skillsResponse.json();
      if (skillsData.success) setSkills(skillsData.skills || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = async (skill) => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: skill._id,
          skillOwnerId: skill.userId,
          selectedDate: new Date().toISOString(),
        }),
      });
      const chatData = await response.json();
      if (chatData.success) router.push(`/appBar/inbox/chat/${chatData.chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Error starting chat. Please try again.");
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="min-h-screen flex">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">Chats</h1>
          <p className="text-gray-600">Manage your conversations and find new skills to learn</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills List */}
          <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto pr-2 ">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                onClick={() => handleSkillClick(skill)}
                className="flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all shadow-sm border border-white hover:shadow-lg hover:scale-103 duration-300"
              >
                {/* Avatar */}
                <img
                  src={skill.userImage || `https://ui-avatars.com/api/?name=${skill.userName}&background=007bff&color=fff`}
                  alt={skill.userName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                {/* Bubble */}
                <div className="flex-1">
                  <div className="rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h1 className="text-xl font-bold">{skill.userName}</h1>
                        <p className="text-sm text-[#9ca3af]">{skill.category}</p>
                        <p className="text-sm text-[#9ca3af]">{skill.description || "No description available"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className="flex-1 h-screen">{children}</div>
    </div>
  );
}
