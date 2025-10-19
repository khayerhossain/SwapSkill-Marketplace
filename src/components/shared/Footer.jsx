"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
} from "react-icons/fa";
import Container from "./Container";
import logo from "../../assets/logo.png";

export default function FooterPage() {
  return (
    <footer className="bg-[#111111] text-gray-200 py-12 ">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Branding / Logo */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logo} alt="SwapSkill Logo" width={40} height={40} />
              <h1 className="font-bold text-2xl text-red-500">SwapSkill</h1>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed">
              Learn new skills, share your expertise, and earn while teaching
              others. Join our community-driven learning platform today and
              become a part of a global skill-sharing movement.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h6 className="font-semibold text-gray-300 mb-3">Explore</h6>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <li>
                <Link href="/find-skills" className="hover:text-red-500">
                  Find Skills
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-red-500">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/become-mentor" className="hover:text-red-500">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link href="/post-skill" className="hover:text-red-500">
                  Post Your Skill
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h6 className="font-semibold text-gray-300 mb-3">Company</h6>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-red-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-red-500">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-red-500">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links + Payment Cards */}
          <div className="flex flex-col justify-between">
            <div>
              <h6 className="font-semibold text-gray-300 mb-3">Legal</h6>
              <ul className="flex flex-col gap-2 text-gray-400 text-sm mb-6">
                <li>
                  <Link href="/terms" className="hover:text-red-500">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-red-500">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-red-500">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payment Cards Right */}
            <div>
              <h6 className="font-semibold text-gray-300 mb-2">We Accept</h6>
              <div className="flex justify-end gap-3 text-3xl">
                <FaCcVisa className="hover:text-red-500 transition-colors" />
                <FaCcMastercard className="hover:text-red-500 transition-colors" />
                <FaCcPaypal className="hover:text-red-500 transition-colors" />
                <FaCcStripe className="hover:text-red-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SwapSkill. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
