"use client";
import Container from "@/components/shared/Container";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaGlobe,
  FaLightbulb,
  FaUsers,
} from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 px-4">
      <Container>
        <div className=" mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose <span className="text-red-500">Skill Swap?</span>
          </motion.h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300 flex flex-col items-center text-center h-64 border border-gray-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FaChalkboardTeacher className="text-4xl text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Learn & Teach</h3>
              <p className="text-gray-600">
                Share your skills and learn new things from others — all for
                free!
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300 flex flex-col items-center text-center h-64 border border-gray-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FaGlobe className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Connect Globally</h3>
              <p className="text-gray-600">
                Connect with people worldwide, exchange skills, and make new
                networks.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300 flex flex-col items-center text-center h-64 border border-gray-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FaLightbulb className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Grow Faster</h3>
              <p className="text-gray-600">
                Improve your skills quickly through practical learning and
                real-life experience.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300 flex flex-col items-center text-center h-64 border border-gray-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <FaUsers className="text-4xl text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-gray-600">
                Be part of a friendly community where people support and
                motivate each other.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
