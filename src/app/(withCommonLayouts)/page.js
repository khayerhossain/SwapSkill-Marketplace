import AboutSection from "@/components/HomePage/AboutSection";
import HeroSection from "@/components/HomePage/HeroSection";
import React from "react";

import WhyChooseUs from "@/components/HomePage/WhyChooseUs";
import FAQSection from "@/UI/HomePage/FAQSection";
import ReviewsSection from "@/components/HomePage/ReviewsSection";


export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection/>
      <FAQSection></FAQSection>
      <WhyChooseUs></WhyChooseUs>
      <ReviewsSection></ReviewsSection>

    
    </>
  );
}
