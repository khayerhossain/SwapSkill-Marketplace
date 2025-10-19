"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  User,
  Settings,
  Box,
  MessageSquare,
  Coins,
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCheck,
  Wallet,
  Search,
} from "lucide-react";

const Sidebar = ({
  onClick,
  useAppBarPaths = false,
  collapsed = false,
  isDashboard = false,
  role = "user",
}) => {
  const pathname = usePathname();

  // Paths
  const communityPath = useAppBarPaths ? "/appBar/community" : "/community";
  const findSkillsPath = useAppBarPaths
    ? "/appBar/find-skills"
    : "/find-skills";
  const profilePath = useAppBarPaths ? "/appBar/profile" : "/profile";
  const shareSkillsPath = useAppBarPaths
    ? "/appBar/share-skills"
    : "/share-skills";
  const earnCoin = useAppBarPaths ? "/appBar/earn-coin" : "/earn-coin";
  const userPayment = useAppBarPaths ? "/appBar/overview" : "/overview";
  const dashboardPath = "/dashboard";
  const resourcesPath = useAppBarPaths ? "/appBar/resources" : "/resources";
  const inboxPath = useAppBarPaths ? "/appBar/inbox" : "/inbox";

  const iconByName = (name) => {
    switch (name) {
      case "Home":
        return <Home size={20} />;
      case "Community":
        return <Users size={20} />;
      case "Find Skills":
        return <Search size={20} />;
      case "Profile":
        return <User size={20} />;
      case "Share Skills":
        return <Briefcase size={20} />;
      case "Overview":
        return <LayoutDashboard size={20} />;
      case "Resources":
        return <FileText size={20} />;
      case "Earn Coin":
        return <Coins size={20} />;
      case "Inbox":
        return <MessageSquare size={20} />;
      case "Settings":
        return <Settings size={20} />;
      case "Subscribers":
        return <UserCheck size={20} />;
      case "Users":
        return <Users size={20} />;
      case "Current Skills":
        return <Briefcase size={20} />;
      case "Management":
        return <Users size={20} />;
      case "Balance":
        return <Wallet size={20} />;
      case "Dashboard":
        return <LayoutDashboard size={20} />;
      default:
        return <Box size={20} />;
    }
  };

  const appBarItems = [
    { name: "Community", path: communityPath },
    { name: "Find Skills", path: findSkillsPath },
    { name: "Profile", path: profilePath },
    { name: "Share Skills", path: shareSkillsPath },
    { name: "Overview", path: userPayment },
    { name: "Resources", path: resourcesPath },
    { name: "Earn Coin", path: earnCoin },
    { name: "Inbox", path: inboxPath },
    { name: "Saved", path: "/appBar/saved-items" },
  ];

  const dashboardItems = [
    { name: "Profile", path: "/dashboard/profile", role: "all" },
    { name: "Settings", path: "/dashboard/settings", role: "all" },
    { name: "Dashboard", path: dashboardPath, role: "all" },
    {
      name: "Subscribers",
      path: "/dashboard/admin/subscribers",
      role: "admin",
    },
    { name: "Users", path: "/dashboard/admin/users", role: "admin" },
    {
      name: "Current Skills",
      path: "/dashboard/admin/current-skills",
      role: "admin",
    },
    { name: "Management", path: "/dashboard/manageSkills", role: "admin" },
    { name: "Balance", path: "/dashboard/admin/balance", role: "admin" },
  ];

  const menuItems = isDashboard
    ? dashboardItems.filter((item) => item.role === "all" || role === "admin")
    : appBarItems;

  return (
    <ul
      className={`h-screen ${
        collapsed ? "px-2" : "px-4"
      } bg-[#111111] py-4 space-y-2`}
    >
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ${
              pathname === item.path
                ? "bg-red-500 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-800 hover:text-red-500"
            }`}
            onClick={onClick}
          >
            {iconByName(item.name)}
            <span className={collapsed ? "hidden" : "block"}>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
