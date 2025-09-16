"use client";
import Container from "@/components/shared/Container";
import { useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

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
    <Container>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left side */}
            <div className="md:w-1/2 space-y-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 py-2 px-4 border border-base-300 w-fit rounded-lg">
                  <FaRegCircle className=" text-purple-600" />
                  <p className="text-purple-600 text-xs">
                    Got questions? We’ve got answers!
                  </p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold text-gray-900 mt-5">
                  Frequently asked questions
                </h1>
                <p className="text-gray-600 text-sm md:text-base mt-3 max-w-md">
                  Here are some of the most common questions about SwapSkill to
                  help you get started quickly.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-md p-6">
                <h2 className="font-semibold text-gray-900 mb-2">
                  Still have questions?
                </h2>
                <p className="text-gray-600 mb-4 max-w-sm text-sm">
                  If you can&apos;t find the answer you&apos;re looking for, our
                  support team is ready to assist you.
                </p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2 text-xs">
                    Send email
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Right side: Accordion */}
            <div className="md:w-1/2 flex flex-col justify-between gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="flex justify-between items-center w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors duration-200 hover:bg-purple-50"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <FaChevronDown
                      className={`h-5 w-5 text-purple-600 transition-transform duration-500 ease-in-out ${
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
                        <p className="p-5 text-gray-600 text-xs md:text-base leading-relaxed">
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
      </section>
    </Container>
  );
}