"use client";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Skill Swap?
        </motion.h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3">🤝 Learn & Teach</h3>
            <p className="text-gray-600">
              Here you can share your skills and learn new things from others — all for free!
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-3">🌍 Connect Globally</h3>
            <p className="text-gray-600">
              You will be able to connect with people from all over the world and exchange skills. 
              You will make new friends and create new networks.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-3">💡 Grow Faster</h3>
            <p className="text-gray-600">
              You will be able to quickly improve your skills through practical learning. 
              You will have real life experience with us.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
