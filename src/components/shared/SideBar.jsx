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

  const communityPath = useAppBarPaths ? "/appBar/community" : "/community";
  const findSkillsPath = useAppBarPaths
    ? "/appBar/find-skills"
    : "/find-skills";
  const profilePath = useAppBarPaths ? "/appBar/profile" : "/profile";
  const shareSkillsPath = useAppBarPaths
    ? "/appBar/share-skills"
    : "/share-skills"; 
  const earnCoin = useAppBarPaths
    ? "/appBar/earn-coin"
    : "/earn-coin"; 


  const userPayment = useAppBarPaths ? "/appBar/overview" : "/overview";
  const dashboardPath = useAppBarPaths ? "/dashboard" : "/dashboard";
  const resourcesPath = useAppBarPaths ? "/appBar/resources" : "/resources";
  const inboxPath = useAppBarPaths ? "/appBar/inbox" : "/inbox";

  const iconByName = (name) => {
    switch (name) {
      case "Home":
        return <Home size={18} />;
      case "Community":
        return <Users size={18} />;
      case "Find Skills":
        return <Search size={18} />;
      case "Profile":
        return <User size={18} />;
      case "Share Skills":
        return <Briefcase size={18} />;
      case "Overview":
        return <LayoutDashboard size={18} />;
      case "Resources":
        return <FileText size={18} />;
      case "Earn Coin":
        return <Coins size={18} />;
      case "Inbox":
        return <MessageSquare size={18} />;
      case "Settings":
        return <Settings size={18} />;
      case "Subscribers":
        return <UserCheck size={18} />;
      case "Users":
        return <Users size={18} />;
      case "Current Skills":
        return <Briefcase size={18} />;
      case "Management":
        return <Users size={18} />;
      case "Balance":
        return <Wallet size={18} />;
      case "Dashboard":
        return <LayoutDashboard size={18} />;
      default:
        return <Box size={18} />;
    }
  };

  const appBarItems = [
    { name: "Home", icon: iconByName("Home"), path: "/" },
    { name: "Community", icon: iconByName("Community"), path: communityPath },
    { name: "Find Skills", icon: iconByName("Find Skills"), path: findSkillsPath },
    { name: "Profile", icon: iconByName("Profile"), path: profilePath },
    { name: "Share Skills", icon: iconByName("Share Skills"), path: shareSkillsPath },
    { name: "Overview", icon: iconByName("Overview"), path: userPayment },
    { name: "Resources", icon: iconByName("Resources"), path: resourcesPath },
    { name: "Earn Coin", icon: iconByName("Earn Coin"), path: earnCoin },
    { name: "Inbox", icon: iconByName("Inbox"), path: inboxPath },
  ];

  const dashboardItems = [
    { name: "Profile", icon: iconByName("Profile"), path: "/dashboard/profile", role: "all" },
    { name: "Settings", icon: iconByName("Settings"), path: "/dashboard/settings", role: "all" },
    { name: "Dashboard", icon: iconByName("Dashboard"), path: dashboardPath, role: "all" },
    { name: "Subscribers", icon: iconByName("Subscribers"), path: "/dashboard/admin/subscribers", role: "admin" },
    { name: "Users", icon: iconByName("Users"), path: "/dashboard/admin/users", role: "admin" },
    { name: "Current Skills", icon: iconByName("Current Skills"), path: "/dashboard/admin/current-skills", role: "admin" },
    { name: "Management", icon: iconByName("Management"), path: "/dashboard/manageSkills", role: "admin" },
    { name: "Balance", icon: iconByName("Balance"), path: "/dashboard/admin/balance", role: "admin" },
  ];

  const menuItems = isDashboard
    ? dashboardItems.filter((item) => item.role === "all" || role === "admin")
    : appBarItems;

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
