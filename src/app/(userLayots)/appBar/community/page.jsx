"use client";

import { UserStatsProvider } from "@/context/UserStatsContext";
import CommunityFeed from "./CommunityFeed/CommunityFeed";
import LeftSide from "./LeftSide/LeftSide";
import RightSide from "./RightSide/RightSide";

export default function AppBarCommunity() {
  return (
  <UserStatsProvider>
    <div className="flex w-full h-screen text-white">
      {/* Left Sidebar */}
      <div className="w-[25%] sticky top-0 h-screen p-4 hidden lg:block">
        <div className="backdrop-blur-md rounded-xl border border-gray-700 p-4 h-full overflow-y-auto">
          <LeftSide />
        </div>
      </div>

      {/* Feed (Scrollable only center) */}
      <div className="w-full lg:w-[53%] overflow-y-auto scrollbar-hide p-4">
        <CommunityFeed />
      </div>

      {/* Right Sidebar */}
      <div className="w-[22%] sticky top-0 h-screen p-4 hidden lg:block">
        <div className="backdrop-blur-md rounded-xl border border-gray-700 p-4 h-full overflow-y-auto">
          <RightSide />
        </div>
      </div>
    </div>
    </UserStatsProvider>
  );
}
