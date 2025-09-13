import AboutSection from "@/components/HomePage/AboutSection";
import HeroSection from "@/components/HomePage/HeroSection";
import React from "react";

export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection/>
    </>
  );
}
