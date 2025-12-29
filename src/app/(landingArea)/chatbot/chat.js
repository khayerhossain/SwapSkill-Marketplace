"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there 👋 Welcome to SwapSkill! I’m your AI assistant — need help finding a skill, booking a class, or learning how things work?",
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
      const response = await axiosInstance.post("/ai", {
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
            content: "Hmm 😅 something went wrong. Try again after a moment, chief.",
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 45 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white z-50 group border border-white/20"
          >
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 group-hover:hidden"></div>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
              alt="Bot" 
              className="h-10 w-10 relative z-10 brightness-0 invert"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-[95%] sm:w-[400px] h-[600px] max-h-[85vh] flex flex-col backdrop-blur-3xl bg-[#111]/85 border border-white/10 rounded-3xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-red-600/90 to-[#991b1b]/90 backdrop-blur-md flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-lg">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
                      alt="Bot" 
                      className="h-7 w-7 brightness-0 invert"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight flex items-center gap-1.5">
                    SwapSkill Assistant <Sparkles className="h-3 w-3 text-yellow-300" />
                  </h3>
                  <p className="text-[10px] text-red-100 font-medium uppercase tracking-[0.1em]">AI Powered Assistant</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-colors border border-white/10"
              >
                <X className="h-4 w-4 text-white" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  key={index}
                  className={`flex items-end gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center border backdrop-blur-md ${
                    msg.role === "user" 
                    ? "bg-red-500/20 border-red-500/30" 
                    : "bg-white/10 border-white/20"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-red-400" />
                    ) : (
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
                        alt="Bot" 
                        className="h-5 w-5 brightness-0 invert opacity-70"
                      />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`relative max-w-[75%] px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl rounded-br-none"
                        : "bg-white/5 border border-white/10 text-gray-200 backdrop-blur-md rounded-2xl rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                    {/* Tiny triangle for speech effect */}
                    <div className={`absolute bottom-0 w-2 h-2 ${
                      msg.role === "user" 
                      ? "-right-1 bg-red-800" 
                      : "-left-1 bg-white/5 border-l border-b border-white/10"
                    } transform rotate-45`}></div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
                      alt="Bot" 
                      className="h-5 w-5 brightness-0 invert opacity-40 animate-pulse"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 backdrop-blur-md">
                    <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-black/40 border-t border-white/10 backdrop-blur-2xl">
              <div className="relative group">
                <div className="relative flex gap-2 items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 px-5 py-3.5 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/40 hover:bg-white/10 transition-all duration-300"
                  />
                  <motion.button
                    whileHover={!input.trim() || isLoading ? {} : { scale: 1.05, x: 2 }}
                    whileTap={!input.trim() || isLoading ? {} : { scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`p-3.5 rounded-2xl text-white transition-all duration-300 ${
                      isLoading || !input.trim()
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5"
                        : "bg-gradient-to-r from-red-600 to-rose-500 active:shadow-inner"
                    }`}
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

