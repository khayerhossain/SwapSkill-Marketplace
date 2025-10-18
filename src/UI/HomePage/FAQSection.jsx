"use client";
import Container from "@/components/shared/Container";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaRegCircle } from "react-icons/fa";

const faqs = [
  {
    question: "What is SwapSkill and how does it work?",
    answer:
      "SwapSkill is a platform where you can exchange your skills with others. For example, you can teach someone graphic design and, in return, learn web development from them. You also earn rewards while sharing your knowledge.",
  },
  {
    question: "Do I need to pay to join SwapSkill?",
    answer:
      "No! Joining SwapSkill is completely free. You can start exchanging skills right away. There are optional premium features for faster growth, but they’re not required.",
  },
  {
    question: "Can I earn money through SwapSkill?",
    answer:
      "Yes! You can monetize your expertise by offering paid sessions or joining reward programs for teaching others.",
  },
  {
    question: "What types of skills can I exchange?",
    answer:
      "You can exchange almost any skill – from coding, marketing, and design to photography, cooking, or language learning. If you have a skill, someone out there is ready to learn it!",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-gray-200 overflow-hidden">
      <Container>
        <div className=" mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left side */}
            <div className="lg:w-1/2 flex flex-col justify-between space-y-8">
              <div>
                <div className="flex items-center gap-4 py-2 px-4 border border-red-500 w-fit rounded-lg">
                  <FaRegCircle className=" text-red-500" />
                  <p className="text-red-500 text-xs">
                    Got questions? We’ve got answers!
                  </p>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5">
                  Frequently Asked Questions
                </h1>
                <p className="text-gray-400 text-sm md:text-base mt-3 max-w-md">
                  Here are some of the most common questions about SwapSkill to
                  help you get started quickly.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                <h2 className="font-semibold text-white mb-2">
                  Still have questions?
                </h2>
                <p className="text-gray-300 mb-4 text-sm max-w-sm">
                  If you can&apos;t find the answer you&apos;re looking for, our
                  support team is ready to assist you.
                </p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Send email
                </motion.button>
              </div>
            </div>

            {/* Right side: Accordion */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="flex justify-between items-center w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 hover:bg-white/10"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-semibold text-white">
                      {faq.question}
                    </span>
                    <FaChevronDown
                      className={`h-5 w-5 text-red-500 transition-transform duration-500 ease-in-out ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 text-gray-300 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
