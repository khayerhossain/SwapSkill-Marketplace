<<<<<<< HEAD
import AboutSection from "@/components/HomePage/AboutSection";
import HeroSection from "@/components/HomePage/HeroSection";
import React from "react";
=======

import WhyChooseUs from "@/components/HomePage/WhyChooseUs";
import FAQSection from "@/UI/HomePage/FAQSection";
import HeroSection from "@/UI/HomePage/HeroSection";
>>>>>>> c1c5b3c4c574e6fa0dfed1047e612b391b28b686

export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection/>
      <FAQSection></FAQSection>
      <WhyChooseUs></WhyChooseUs>
      
    
    </>
  );
}
