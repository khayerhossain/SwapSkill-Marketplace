"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUserCheck,
  FaUserFriends,
  FaBox,
  FaDollarSign,
} from "react-icons/fa";

const Sidebar = ({ onClick }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    {
      name: "All Users",
      icon: <FaUserFriends />,
      path: "/dashboard/admin/applied-riders",
    },
    {
      name: "Subscribers",
      icon: <FaUserCheck />,
      path: "/dashboard/admin/approved-riders",
    },
    {
      name: "Activity",
      icon: <FaBox />,
      path: "/dashboard/admin/total-orders",
    },
    {
      name: "Balance",
      icon: <FaDollarSign />,
      path: "/dashboard/admin/balance",
    },
    {
      name: "Support",
      icon: <FaDollarSign />,
      path: "/dashboard/rider/support",
    },
  ];

  return (
    <ul className="space-y-2 px-4 h-screen">
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-medium
              ${
                pathname === item.path
                  ? "bg-white text-red-600"
                  : "hover:bg-gray-700"
              }`}
            onClick={onClick}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
