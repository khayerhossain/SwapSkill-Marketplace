import FooterPage from "@/components/shared/Footer";
import NavbarPage from "@/components/shared/Navbar";
import React from "react";

export default function layout({ children }) {
  return (
    <div>
      <NavbarPage />
      {children}
      <FooterPage />
    </div>
  );
}
