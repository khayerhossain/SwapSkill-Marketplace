"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Container from "@/components/shared/Container";
import { motion } from "framer-motion";

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "John Doe",
      title: "Entrepreneur",
      date: "20/08/2025",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam temporibus quidem magni qui doloribus quasi natus inventore nisi velit minima.",
    },
    {
      id: 2,
      name: "Sarah Smith",
      title: "Web Developer",
      date: "02/09/2025",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      review:
        "This platform helped me grow faster by learning from others. Highly recommended for skill exchange and networking.",
    },
    {
      id: 3,
      name: "David Kim",
      title: "Chef",
      date: "10/09/2025",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      review:
        "Amazing experience! I shared cooking lessons and learned English in return. A perfect skill swap solution.",
    },
    {
      id: 4,
      name: "Maria Lopez",
      title: "Graphic Designer",
      date: "12/09/2025",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      review:
        "A great way to exchange knowledge without spending money. Love the idea of community learning.",
    },
  ];

  return (
    <section className="relative py-28 bg-[#111111]  text-gray-200 overflow-hidden">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="font-medium text-red-500 mb-2 text-sm uppercase tracking-wider">
            Hear from our community
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What People Say
          </h2>
          <p className="text-gray-400 text-lg">
            Our users are constantly exchanging skills, learning, and growing
            together. Here’s what they think.
          </p>
        </motion.div>

        {/* Swiper Cards */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((item, index) => (
            <SwiperSlide key={item.id}>
              <motion.div
                className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-[300px] items-center text-center hover:bg-white/10 hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-500 shadow-lg"
                  />
                </div>

                {/* Name & Title */}
                <h4 className="text-lg font-semibold text-white mb-1">
                  {item.name}
                </h4>
                <p className="text-sm mb-3 flex flex-wrap justify-center gap-2">
                  <span className="bg-gradient-to-r from-red-500 to-red-700 px-2 py-0.5 rounded-xl text-white font-medium">
                    {item.title}
                  </span>
                  <span className="bg-gray-800/50 text-gray-200 px-2 py-0.5 rounded-xl">
                    {item.date}
                  </span>
                </p>

                {/* Review */}
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{item.review}"
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* subtle glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  );
}
