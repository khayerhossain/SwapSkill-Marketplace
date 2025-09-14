"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import React from "react";
import Container from "./Container";

export default function NavbarPage() {
  const { data: session } = useSession();
  const pathname = usePathname(); // get current route

  // List of nav links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Skills", path: "/find-skills" },
    { name: "Community", path: "/community" },
    { name: "Projects", path: "/projects" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 px-0">
      <Container>
        <div className="flex justify-between w-full items-center">
          {/* Navbar Start: Project Name + Mobile Menu */}
          <div className="navbar-start flex items-center gap-4 px-0">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              {/* Mobile Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className={`${
                        pathname === link.path
                          ? "font-semibold text-black border-2 border-black"
                          : "font-semibold text-gray-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Project Name */}
            <Link href="/" className="text-xl font-bold">
              Swap Skill
            </Link>
          </div>

          {/* Navbar Center (Desktop) */}
          <div className="navbar-center hidden lg:flex px-0">
            <ul className="menu menu-horizontal px-1 gap-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`transition ${
                      pathname === link.path
                        ? "font-semibold text-black underline border-black"
                        : "font-semibold text-gray-600 hover:text-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navbar End: Profile + Buttons */}
          <div className="navbar-end flex items-center gap-2 px-0">
            {session?.user?.name && (
              <div className="px-3 py-3 rounded-full bg-gray-200 text-black font-medium">
                {session.user.name}
              </div>
            )}

            {session ? (
              <button
                onClick={() => signOut()}
                className="btn bg-red-500 text-white rounded-2xl"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="btn">
                  Login
                </Link>
                <Link href="/register" className="btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
