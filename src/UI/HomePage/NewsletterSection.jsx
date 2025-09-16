"use client";
import { useState } from "react";
import axios from "axios";
import Container from "@/components/shared/Container";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/newsletter", { email });
      if (res.data?.success) {
        setMessage(" Subscribed successfully!");
        setEmail("");
      } else {
        setMessage("Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage(" Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[420px] flex items-center justify-center bg-white p-6 mt-0 lg:mt-16">
      <Container>
        <div className="relative w-ful rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-b from-red-600 to-red-500" />

          <div className="relative bg-white rounded-3xl p-12 shadow-inner md:p-16">
            <div className="absolute -bottom-6 left-10 right-10 h-6 rounded-xl bg-white/0 shadow-[0_35px_35px_rgba(0,0,0,0.12)] pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center">
              {/* Curved line + rocket/paper-plane icon */}
              <div className="flex items-center justify-center mb-6">
                <svg
                  width="240"
                  height="80"
                  viewBox="0 0 240 80"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  {/* Curved flight path */}
                  <path
                    d="M10 60 C80 10, 160 10, 230 40"
                    stroke="#D1D5DB"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Paper-plane/rocket icon */}
                  <g transform="translate(210,22) rotate(-10)">
                    <path
                      d="M2 10 L28 0 L18 30 L10 22 L2 10 Z"
                      fill="#EF4444"
                    />
                    <path d="M2 10 L10 22 L12 14 Z" fill="#B91C1C" />
                    <circle cx="16" cy="12" r="2" fill="#fff" />
                  </g>
                </svg>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2">
                SUBSCRIBE<span className="text-red-500">.</span>
              </h1>

              <p className="text-gray-500 mb-8">
                Get the latest updates and offers delivered straight to your
                inbox.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center"
              >
                <div className="w-full sm:w-2/3">
                  <label className="relative block">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-none px-4 py-4 text-gray-700 placeholder-gray-300 focus:outline-none text-lg"
                    />
                    <div className="h-[1px] bg-gray-200 w-full" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "SUBSCRIBE"}
                </button>
              </form>

              {message && (
                <p className="mt-6 text-sm text-gray-600">{message}</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
