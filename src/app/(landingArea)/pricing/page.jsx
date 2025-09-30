"use client";
import Container from "@/components/shared/Container";
import AOS from "aos";
import "aos/dist/aos.css";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  AOS.init({
    duration: 800, // animation duration
    easing: "ease-in-out",
    once: true, // run only once
  });
  const plans = [
    {
      name: "Learner",
      monthly: 25,
      yearly: 20,
      description: "Perfect for individuals who want to learn new skills.",
      features: [
        "Browse all skill categories",
        "Book up to 5 sessions per month",
        "Join community discussions",
        "Earn gamified points & rewards",
        "Basic chat support",
      ],
      button: "Start Learning",
    },
    {
      name: "Pro Tutor",
      monthly: 75,
      yearly: 60,
      description:
        "For tutors & learners who want full access and verified features.",
      features: [
        "Post unlimited skills to teach",
        "Unlimited bookings & scheduling",
        "Take category-based tests for Verified Badge",
        "Gamified quizzes & reward system",
        "Real-time chat & messaging",
        "Secure payments & transaction history",
      ],
      button: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      monthly: 150,
      yearly: 120,
      description: "For organizations managing multiple learners & tutors.",
      features: [
        "All Pro Tutor features",
        "Unlimited learners & teachers",
        "Team management & advanced analytics",
        "Custom domain support",
        "Priority customer support",
      ],
      button: "Contact Us",
    },
    {
      name: "Custom",
      monthly: "175",
      yearly: "—",
      description: "Tailored solution for your unique learning needs.",
      features: [
        "Fully customizable features",
        "Dedicated account manager",
        "Advanced security options",
        "Integration with external tools",
      ],
      button: "Request Quote",
    },
  ];

  // Modal open করার জন্য
  const handlePrice = (name) => {
    const plan = plans.find((p) => p.name === name);
    if (!plan) return;
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Payment selection
  const handlePayment = (method) => {
    if (!selectedPlan) return;

    const params = new URLSearchParams({
      name: selectedPlan.name ?? "",
      price: String(selectedPlan.monthly ?? ""),
    });

    let path = "";
    if (method === "sslcommerz") {
      path = `/checkout?${params.toString()}`;
    } else if (method === "stripe") {
      path = `/checkoutStripe?${params.toString()}`;
    }

    setIsModalOpen(false);
    router.push(path);
  };

  return (
    <div className="bg-base-100 min-h-screen py-16 text-base-content">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Pricing</h2>
        <p className="text-base-content/70 mt-2">
          Simple, transparent pricing. No hidden fees.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span
            className={`cursor-pointer ${
              billing === "monthly"
                ? "text-red-500 font-bold"
                : "text-base-content/70"
            }`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </span>
          <span className="text-base-content/50">/</span>
          <span
            className={`cursor-pointer ${
              billing === "yearly"
                ? "text-red-500 font-bold"
                : "text-base-content/70"
            }`}
            onClick={() => setBilling("yearly")}
          >
            Yearly <span className="text-green-500">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Plans */}
      <Container>
        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-base-200 border border-base-300 rounded-lg p-4 flex flex-col hover:border-red-500 transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-base-content/70 mb-3 text-sm">
                  {plan.description}
                </p>
                <div className="text-2xl font-bold mb-3">
                  {plan.monthly !== "—" ? (
                    <>
                      ${billing === "monthly" ? plan.monthly : plan.yearly}
                      <span className="text-sm font-medium text-base-content/70">
                        /mo
                      </span>
                    </>
                  ) : (
                    <span className="text-base text-base-content/70">
                      Custom Pricing
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-4 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check size={16} className="text-red-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handlePrice(plan.name)}
                className={`mt-auto py-2 px-4 rounded-md font-semibold text-center text-sm ${
                  plan.button === "Contact Us" ||
                  plan.button === "Request Quote"
                    ? "bg-red-700 hover:bg-red-800 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </Container>

      {/* daisyUI Modal */}
      {isModalOpen && selectedPlan && (
        <dialog open className="modal">
          <div data-aos="fade-up" className="modal-box border">
            <h3 className="font-bold text-lg mb-3">Choose Payment Method</h3>
            <p className="mb-4 text-sm">
              Selected Plan:{" "}
              <span className="font-semibold">{selectedPlan.name}</span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePayment("sslcommerz")}
                className="btn btn-primary"
              >
                Pay with SSLCommerz
              </button>
              <button
                onClick={() => handlePayment("stripe")}
                className="btn btn-secondary"
              >
                Pay with Stripe
              </button>
            </div>

            <div className="modal-action">
              <button onClick={() => setIsModalOpen(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
