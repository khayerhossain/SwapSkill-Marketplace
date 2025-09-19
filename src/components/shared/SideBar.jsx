"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaHome,
  FaUserCheck,
  FaUserFriends,
  FaBox,
  FaDollarSign,
} from "react-icons/fa";

const Sidebar = ({ onClick, useAppBarPaths = false, collapsed = false }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "user";

  const communityPath = useAppBarPaths ? "/appBar/community" : "/community";
  const findSkillsPath = useAppBarPaths ? "/appBar/find-skills" : "/find-skills";
  const shareSkillsPath = useAppBarPaths ? "/appBar/share-skills" : "/share-skills";
  const dashboardPath = useAppBarPaths ? "/dashboard" : "/dashboard";

  const baseItems = [
    { name: "Home", icon: <FaHome />, path: "/", role: "all" },
    { name: "Community", icon: <FaUserFriends />, path: communityPath, role: "all" },
    { name: "Find Skills", icon: <FaBox />, path: findSkillsPath, role: "all" },
    { name: "Share Skills", icon: <FaBox />, path: shareSkillsPath, role: "all" },
  ];

  const adminItems = [
    { name: "Dashboard", icon: <FaHome />, path: dashboardPath, role: "admin" },
    { name: "Subscribers", icon: <FaUserCheck />, path: "/dashboard/admin/subscribers", role: "admin" },
  ];

  const menuItems = (role === "admin" ? [...baseItems, ...adminItems] : baseItems).filter(
    (item) => item.role === "all" || item.role === role
  );

  return (
    <ul className={`space-y-2 ${collapsed ? "px-2" : "px-4"} h-screen`}>
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${
              pathname === item.path
                ? "bg-base-100 text-primary"
                : "text-base-content/80 hover:bg-base-200"
            }`}
            onClick={onClick}
          >
            {item.icon}
            <span className={collapsed ? "hidden" : "block"}>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
