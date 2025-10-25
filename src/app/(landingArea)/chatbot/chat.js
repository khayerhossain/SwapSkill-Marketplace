"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there 👋 Welcome to SwapSkill! I’m your AI assistant — need help finding a skill, booking a class, or learning how things work?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/ai", {
        message: input
      });

      const data = response.data;

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Hmm 😅 something went wrong. Try again after a moment, chief.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Server issue 😕 Please try again in a bit.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-xl bg-red-600 hover:bg-red-700 flex items-center justify-center text-white z-50 transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-[90%] sm:w-80 md:w-96 h-[80vh] sm:h-[480px] flex flex-col backdrop-blur-2xl bg-gradient-to-br from-[#111]/95 via-[#181818]/90 to-[#222]/80 border border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm sm:text-base">
                SwapSkill Assistant
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700/80 p-1 rounded-full transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 text-gray-100 scrollbar-thin scrollbar-thumb-red-700/30">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2.5 sm:p-3 text-sm transition-all duration-300 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 backdrop-blur-lg">
            <div className="flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm text-white placeholder-gray-400 bg-white/5 border border-red-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/60 hover:border-red-400 transition-all duration-300"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-3 rounded-xl text-white transition-all duration-300 ${
                  isLoading || !input.trim()
                    ? "bg-red-400/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
