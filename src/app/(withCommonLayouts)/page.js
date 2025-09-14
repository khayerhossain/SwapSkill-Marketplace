import AboutSection from "@/UI/HomePage/AboutSection";
import HeroSection from "@/UI/HomePage/HeroSection";
import NewsletterSection from "@/UI/HomePage/NewsletterSection";
import React from "react";
import WhyChooseUs from "@/UI/HomePage/WhyChooseUs";
import FAQSection from "@/UI/HomePage/FAQSection";
import ReviewsSection from "@/UI/HomePage/ReviewsSection";
import SkillMarquee from "@/UI/HomePage/SkillMarquee";
import PopularSkills from "@/UI/HomePage/PopularSkills";

export default async function HomeScreen() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FAQSection></FAQSection>
      <WhyChooseUs></WhyChooseUs>
      <SkillMarquee></SkillMarquee>
      <WhyChooseUs></WhyChooseUs>
      <NewsletterSection />
      <ReviewsSection></ReviewsSection>
      <NewsletterSection />
      <ReviewsSection></ReviewsSection>
      <PopularSkills></PopularSkills>
    </>
  );
}
