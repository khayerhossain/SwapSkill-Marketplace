"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUserCheck,
  FaUserFriends,
  FaBox,
  FaUser,
  FaCog,
  FaUsers,
} from "react-icons/fa";

const Sidebar = ({
  onClick,
  useAppBarPaths = false,
  collapsed = false,
  isDashboard = false,
}) => {
  const pathname = usePathname();

  const communityPath = useAppBarPaths ? "/appBar/community" : "/community";
  const findSkillsPath = useAppBarPaths
    ? "/appBar/find-skills"
    : "/find-skills";
  const profilePath = useAppBarPaths
    ? "/appBar/profile"
    : "/profile";
  const shareSkillsPath = useAppBarPaths
    ? "/appBar/share-skills"
    : "/share-skills";
  const userPayment = useAppBarPaths
    ? "/appBar/user-payment"
    : "/user-payment";
  const dashboardPath = useAppBarPaths ? "/dashboard" : "/dashboard";

  const appBarItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Community", icon: <FaUserFriends />, path: communityPath },
    { name: "Find Skills", icon: <FaBox />, path: findSkillsPath },
    { name: "Profile", icon: <FaBox />, path: profilePath },
    { name: "Share Skills", icon: <FaBox />, path: shareSkillsPath }, 
    { name: "Payment Access", icon: <FaBox />, path: userPayment,  },
  ];

  const dashboardItems = [
    { name: "Profile", icon: <FaUser />, path: "/dashboard/profile" },
    { name: "Settings", icon: <FaCog />, path: "/dashboard/settings" },
    { name: "Home", icon: <FaUsers />, path: "/" },
    { name: "Dashboard", icon: <FaHome />, path: dashboardPath },
    {
      name: "Subscribers",
      icon: <FaUserCheck />,
      path: "/dashboard/admin/subscribers",
    },
    {
      name: "All Users",
      icon: <FaUserCheck />,
      path: "/dashboard/admin/users",
    },
    {
      name: "All Current Skills",
      icon: <FaUserCheck />,
      path: "/dashboard/admin/current-skills",
    },
    { name: "ManageSkills", icon: <FaUsers />, path: "/dashboard/manageSkills", role: "all" },
  ];

  const menuItems = isDashboard ? dashboardItems : appBarItems;

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
