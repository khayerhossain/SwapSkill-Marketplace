"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBox,
  FaCog,
  FaHome,
  FaUser,
  FaUserCheck,
  FaUserFriends,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { LuCoins } from "react-icons/lu";

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
  const userPayment = useAppBarPaths ? "/appBar/overview" : "/overview";
  const dashboardPath = useAppBarPaths ? "/dashboard" : "/dashboard";
  const resourcesPath = useAppBarPaths ? "/appBar/resources" : "/resources";
  const inboxPath = useAppBarPaths ? "/appBar/inbox" : "/inbox";

  const appBarItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Community", icon: <FaUserFriends />, path: communityPath },
    { name: "Find Skills", icon: <FaBox />, path: findSkillsPath },
    { name: "Profile", icon: <FaBox />, path: profilePath },
    { name: "Share Skills", icon: <FaBox />, path: shareSkillsPath },
    { name: "Overview", icon: <FaBox />, path: userPayment },
    { name: "Resources", icon: <FaBox />, path: resourcesPath },
    { name: "Inbox", icon: <FiMessageCircle  />, path: inboxPath },
    { name: "Earn Coin", icon: <LuCoins />, path: earnCoin },
  ];

  const dashboardItems = [
    { name: "Profile", icon: <FaUser />, path: "/dashboard/profile", role: "all" },
    { name: "Settings", icon: <FaCog />, path: "/dashboard/settings", role: "all" },
    { name: "Dashboard", icon: <FaHome />, path: dashboardPath, role: "all" },
    { name: "Subscribers", icon: <FaUserCheck />, path: "/dashboard/admin/subscribers", role: "admin" },
    { name: "Users", icon: <FaUserCheck />, path: "/dashboard/admin/users", role: "admin" },
    { name: "Current Skills", icon: <FaUserCheck />, path: "/dashboard/admin/current-skills", role: "admin" },
    { name: "Management", icon: <FaUsers />, path: "/dashboard/manageSkills", role: "admin" },
    { name: "Balance", icon: <FaMoneyBillWave />, path: "/dashboard/admin/balance", role: "admin" },
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
