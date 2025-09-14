"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

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
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h4 className="font-bold text-orange-500 text-sm mb-2">
          What our customers say about us
        </h4>

        <h2 className="text-3xl font-bold mb-10">
          Testimonials
        </h2>

        <Swiper
          modules={[ Pagination]}
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
          {reviews.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-400"
                    />
                  </div>

                  <div className="px-3 text-left">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      <span className="bg-blue-400 px-2 rounded-xl">
                        {item.title}
                      </span>{" "}
                      <span className="text-gray-700 bg-green-400 px-2 rounded-xl">
                        {item.date}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  "{item.review}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* small arrows */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          width: 28px;
          height: 28px;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px;
        }
      `}</style>
    </section>
  );
}
