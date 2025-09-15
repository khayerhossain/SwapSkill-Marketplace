import React from "react";
import WhyChooseUs from "@/UI/HomePage/WhyChooseUs";
import FAQSection from "@/UI/HomePage/FAQSection";
import ReviewsSection from "@/UI/HomePage/ReviewsSection";
import SkillMarquee from "@/UI/HomePage/CurrentSkills";
import PopularSkills from "@/UI/HomePage/PopularSkills";
import AboutSection from "@/UI/HomePage/AboutSection";
import HeroSection from "@/UI/HomePage/HeroSection";
import NewsletterSection from "@/UI/HomePage/NewsletterSection";
import CurrentSkillsPage from "@/UI/HomePage/CurrentSkills";

export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WhyChooseUs></WhyChooseUs>
      <CurrentSkillsPage />
      <PopularSkills></PopularSkills>
      <ReviewsSection></ReviewsSection>
      <FAQSection></FAQSection>
      <NewsletterSection />
    </>
  );
}
