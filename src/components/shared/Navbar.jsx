"use client";
import { ThemeContext } from "@/context/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, use } from "react";
import logo from "../../assets/logo1.png";
import Container from "./Container";
import { FiHome, FiUsers, FiActivity, FiLayers, FiTag, FiPieChart, FiSmartphone, FiChevronDown, FiArrowRight } from "react-icons/fi";

export default function NavbarPage() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme } = use(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseLinks = [
    { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
    {
      name: "About Us",
      icon: <FiUsers className="w-4 h-4" />,
      dropdown: true,
      items: [
        {
          name: "About Us",
          path: "#about",
          newTab: false,
        },
        {
          name: "More About Us",
          path: "/moreAboutUs",
          newTab: true, // opens in new tab
        },
      ],
    },
    { name: "Current Skills", path: "#current-skills", icon: <FiActivity className="w-4 h-4" /> },
    { name: "Features", path: "/features", icon: <FiLayers className="w-4 h-4" /> },
    { name: "Pricing", path: "/pricing", icon: <FiTag className="w-4 h-4" /> },
  ];

  const roleLinks =
    session?.user?.role === "admin"
      ? [{ name: "Dashboard", path: "/dashboard", icon: <FiPieChart className="w-4 h-4" /> }]
      : session?.user?.role === "user"
      ? [{ name: "AppBar", path: "/appBar", icon: <FiSmartphone className="w-4 h-4" /> }]
      : [];

  const navLinks = [...baseLinks, ...roleLinks];

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-lg shadow-lg" : ""
      }`}
    >
      <Container>
        <div className="flex justify-between items-center w-full py-3 text-white">
          {/* ===== SMALL DEVICES ===== */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center group">
              <Image src={logo} alt="logo" className="w-10 h-8 transition-transform group-hover:scale-110" />
              <h1 className="font-signature-custom text-2xl text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">SwapSkill</h1>
            </Link>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-black/90 rounded-box z-[100] mt-3 w-56 p-2 shadow-lg text-white"
              >
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.dropdown ? (
                      <details>
                        <summary className="cursor-pointer text-gray-300 hover:text-white flex items-center gap-2">
                          {link.icon}
                          {link.name}
                        </summary>
                        <ul className="p-2 bg-black/90 rounded-lg mt-1">
                          {link.items.map((item) => (
                            <li key={item.path}>
                              {item.newTab ? (
                                <a
                                  href={item.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-white"
                                >
                                  {item.name}
                                </a>
                              ) : (
                                <Link
                                  href={item.path}
                                  className={`${
                                    pathname === item.path
                                      ? "font-semibold text-white underline underline-offset-4"
                                      : "text-gray-300 hover:text-white"
                                  }`}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={link.path}
                        scroll={true}
                        className={`${
                          pathname === link.path
                            ? "font-semibold text-white underline underline-offset-4"
                            : "text-gray-300 hover:text-white"
                        } hover:bg-transparent focus:bg-transparent active:bg-transparent flex items-center gap-2`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}

                <div className="flex flex-col gap-2 mt-3">
                  <Link
                    href="/login"
                    className="btn bg-gray-900 hover:bg-gray-800 text-white rounded-lg border-none shadow-none"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn bg-red-600 hover:bg-red-500 text-white rounded-lg border-none shadow-none"
                  >
                    Sign Up
                  </Link>
                </div>
              </ul>
            </div>
          </div>

          {/* ===== LARGE DEVICES ===== */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <Link href="/" className="flex items-center group">
              <Image src={logo} alt="logo" className="w-12 h-9 transition-transform group-hover:scale-110" />
              <h1 className="font-signature-custom text-3xl text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">SwapSkill</h1>
            </Link>

            <div className="flex-1 flex justify-center">
              <ul className="menu menu-horizontal px-1 gap-6">
                {navLinks.map((link) => (
                  <li key={link.name} className="relative group">
                    {link.dropdown ? (
                      <>
                        <button className="transition text-gray-300 hover:text-white flex items-center gap-2 hover:bg-transparent focus:bg-transparent active:bg-transparent">
                          {link.icon}
                          {link.name}
                          <FiChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Dropdown menu */}
                        <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                          <ul className="bg-black/95 backdrop-blur-md rounded-lg p-2 shadow-2xl min-w-[200px] border border-white/10">
                            {link.items.map((item) => (
                              <li key={item.path}>
                                {item.newTab ? (
                                  <a
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white transition-all"
                                  >
                                    {item.name}
                                  </a>
                                ) : (
                                  <Link
                                    href={item.path}
                                    className={`block px-4 py-2 text-sm transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent ${
                                      pathname === item.path
                                        ? "text-white font-semibold"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.path}
                        scroll={true}
                        className={`transition-all duration-300 hover:bg-white/5 px-3 py-1.5 rounded-md flex items-center gap-2 relative group-hover:text-white ${
                          pathname === link.path
                            ? "font-semibold text-white underline underline-offset-4"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <button
                  aria-label="Logout"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="btn bg-red-600 hover:bg-red-500 text-white rounded-lg border-none shadow-none"
                >
                  Sign Out
                </button>
              ) : (
                <div>
                  <Link
                    href="/login"
                    className="btn bg-black/60 hover:bg-gray-800 text-white rounded-lg border-none shadow-none mr-3"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn bg-red-600 hover:bg-red-500 text-white rounded-lg border-none shadow-none"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
