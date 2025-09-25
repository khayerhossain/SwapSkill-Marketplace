"use client";

import CommunityFeed from "./CommunityFeed/CommunityFeed";
import LeftSide from "./LeftSide/LeftSide";
import RightSide from "./RightSide/RightSide";

export default function AppBarCommunity() {
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-[25%] sticky top-0 h-screen p-4 hidden lg:block">
        <LeftSide />
      </div>

      {/* Feed (Scrollable only center) */}
      <div className="w-full lg:w-[53%] overflow-y-auto scrollbar-hide p-4">
        <CommunityFeed />
      </div>

      {/* Right Sidebar */}
      <div className="w-[22%] sticky top-0 h-screen p-4 hidden lg:block">
        <RightSide />
      </div>
    </div>
  );
}
