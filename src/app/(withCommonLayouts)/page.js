
import AboutSection from "@/components/HomePage/AboutSection";
import HeroSection from "@/components/HomePage/HeroSection";
import NewsletterSection from "@/components/HomePage/NewsletterSection";
import React from "react";

import WhyChooseUs from "@/components/HomePage/WhyChooseUs";
import FAQSection from "@/UI/HomePage/FAQSection";



export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection/>
      <FAQSection></FAQSection>
      <WhyChooseUs></WhyChooseUs>
      <NewsletterSection/>

    
    </>
  );
}
