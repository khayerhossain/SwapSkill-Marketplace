"use client";
import { ThemeContext } from "@/context/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, use } from "react";
import logo from "../../assets/logo.png";
import Container from "./Container";

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
    { name: "Home", path: "/" },
    { name: "About Us", path: "#about" },
    { name: "Current Skills", path: "#current-skills" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
  ];

  const roleLinks =
    session?.user?.role === "admin"
      ? [{ name: "Dashboard", path: "/dashboard" }]
      : session?.user?.role === "user"
      ? [{ name: "AppBar", path: "/appBar" }]
      : [];

  const navLinks = [...baseLinks, ...roleLinks];

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-lg shadow-lg" : "bg-black/40"
      }`}
    >
      <Container>
        <div className="flex justify-between items-center w-full py-3 text-white">
          {/* ===== SMALL DEVICES ===== */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="logo" className="w-10 h-8" />
              <h1 className="font-semibold text-lg">SwapSkill</h1>
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
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      scroll={true}
                      className={`${
                        pathname === link.path
                          ? "font-semibold text-white underline underline-offset-4"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
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
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="logo" className="w-12 h-9" />
              <h1 className="font-semibold text-xl">SwapSkill</h1>
            </Link>

            <div className="flex-1 flex justify-center">
              <ul className="menu menu-horizontal px-1 gap-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      scroll={true}
                      className={`transition ${
                        pathname === link.path
                          ? "font-semibold text-white underline underline-offset-4"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {session?.user ? <button
               aria-label="Logout"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="btn bg-red-600 hover:bg-red-500 text-white rounded-lg border-none shadow-none"
              >
                Sign Out
              </button> 
              :                
             <div>
                <Link
                href="/login"
                className="btn bg-gray-900 hover:bg-gray-800 text-white rounded-lg border-none shadow-none mr-3"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn bg-red-600 hover:bg-red-500 text-white rounded-lg border-none shadow-none"
              >
                Sign Up
              </Link>
             </div>} 
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
