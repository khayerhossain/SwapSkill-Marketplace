"use client";
import { ThemeContext } from "@/context/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";
import logo from "../../assets/logo.png";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export default function NavbarPage() {
  const { data: session } = useSession();
  const pathname = usePathname(); // get current route
  const { theme } = use(ThemeContext);

  console.log(theme);

  // Landing page section links + Dashboard
  const navLinks = [
    { name: "Home", path: "/" },
    // { name: "About", path: "/#about" },
    // { name: "Why Choose Us", path: "/#why-choose-us" },
    // { name: "Skills", path: "/#current-skills" },
    // { name: "Reviews", path: "/#reviews" },
    // { name: "FAQ", path: "/#faq" },
    // { name: "Newsletter", path: "/#newsletter" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pricing", path: "/pricing" },
    { name: "Quiz", path: "/quiz" },
    { name: "Test", path: "/test-categories" },
   
  ];

  return (
    <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 px-0">
      <Container>
        <div className="flex justify-between w-full items-center">
          {/* Navbar Start: Logo + Mobile Menu */}
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
                      scroll={true}
                      className={`${
                        pathname === link.path
                          ? "font-semibold text-base-content border-2 border-base-content"
                          : "font-semibold text-base-content/70"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Logo */}
            <Link href="/" className="text-xl font-bold flex">
              <Image
                src={logo}
                alt="logo"
                className={`w-12 h-8 ${theme ==='light' ? '' : ""} `}
              />
              <h1 className="font-light">SwapSkill</h1>
            </Link>
          </div>

          {/* Navbar Center (Desktop) */}
          <div className="navbar-center hidden lg:flex px-0">
            <ul className="menu menu-horizontal px-1 gap-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    scroll={true}
                    className={`transition ${
                      pathname === link.path
                        ? "font-semibold text-base-content underline border-base-content"
                        : "font-semibold text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              <ThemeToggle />
            </p>
          </div>

          {/* Navbar End: Profile + Auth */}
          <div className="navbar-end flex items-center gap-2 px-0">
            {session?.user?.name && (
              <div className="px-3 py-3 rounded-full bg-base-200 text-base-content font-medium">
                {session.user.name}
              </div>
            )}

            {session ? (
              <button
                onClick={() => signOut()}
                className="btn bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="btn bg-gray-800 rounded-lg text-white">
                  Sign In
                </Link>
                <Link href="/register" className="btn bg-red-500 text-white rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
