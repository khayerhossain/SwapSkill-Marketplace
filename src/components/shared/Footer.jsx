import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaStripe } from "react-icons/fa";
import Container from "./Container";

export default function FooterPage() {
  return (
    <footer className="bg-neutral text-neutral-content py-16 mt-10
  ">
      <Container>
        <div className="footer sm:footer-horizontal">
          {/* Branding */}
          <aside>
            <h2 className="text-xl font-bold">SwapSkill Marketplace</h2>
            <p className="text-sm mt-2 max-w-xs">
              Learn new skills, share your expertise, and earn while teaching
              others. Join our community-driven learning platform today.
            </p>
          </aside>

          {/* Quick Links */}
          <nav>
            <h6 className="footer-title">Explore</h6>
            <a className="link link-hover">Find Skills</a>
            <a className="link link-hover">Community</a>
            <a className="link link-hover">Become a Mentor</a>
            <a className="link link-hover">Post Your Skill</a>
          </nav>

          {/* Company */}
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About Us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Careers</a>
            <a className="link link-hover">Blog</a>
          </nav>

          {/* Legal */}
          <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms & Conditions</a>
            <a className="link link-hover">Privacy Policy</a>
            <a className="link link-hover">Refund Policy</a>
          </nav>

          {/* Payment */}
          <nav>
            <h6 className="footer-title">We Accept</h6>
            <div className="flex gap-3 text-3xl mt-2">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <FaStripe />
            </div>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
