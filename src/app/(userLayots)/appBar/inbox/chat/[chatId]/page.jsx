"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  Send,
  Clock,
  MoreVertical,
  Image,
  Smile,
  Paperclip,
  Mic,
  Video,
  Phone,
  Info,
  Search,
  Check,
  CheckCheck,
} from "lucide-react";
import Loading from "@/app/loading";

let socket;

export default function ChatPage() {
  const { chatId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Socket and chat functionality
    if (!session?.user?.id) return;

    // Initialize socket connection
    socket = io(process.env.NEXTAUTH_URL || "http://localhost:3000", {
      query: { userId: session.user.id },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");

      // Join user's personal room for notifications
      socket.emit("join_user", session.user.id);

      // Join chat room
      socket.emit("join_chat", chatId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for new messages
    socket.on("receive_message", (message) => {
      console.log("New message received:", message);
      setMessages(prev => [...prev, message]);    
      
      
      // Mark as read if it's the current user's chat
      if (message.senderId !== session?.user?.id) {
        socket.emit("mark_messages_read", {
          chatId: chatId,
          userId: session?.user?.id,
        });
      }
    });

    // Listen for typing indicators
    socket.on("user_typing", (data) => {
      if (data.userId !== session?.user?.id) {
        setTyping(data.isTyping);

        if (data.isTyping) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
          }, 3000);
        }
      }
    });

    // Load chat details and messages
    loadChatData();

    return () => {
      window.removeEventListener("resize", checkMobile);

      if (socket) {
        socket.off("receive_message");
        socket.off("user_typing");
        socket.off("new_notification");
        socket.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, session]);

  const loadChatData = async () => {
    try {
      setLoading(true);

      const chatResponse = await fetch(`/api/chats/${chatId}`);
      const chatData = await chatResponse.json();
      if (chatData.success) setChat(chatData.chat);

      const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
      const messagesData = await messagesResponse.json();
      if (messagesData.success) {
        setMessages(messagesData.messages);        
        
      }

      if (socket && session?.user?.id) {
        socket.emit("mark_messages_read", { chatId, userId: session.user.id });
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !session?.user || !chat) return;

    const messageData = {
      chatId,
      senderId: session.user.id,
      senderName: session.user.name,
      text: newMessage.trim(),
      receiverId:
        chat.initiatorId === session.user.id
          ? chat.skillOwnerId
          : chat.initiatorId,
    };

    socket.emit("send_message", messageData);

    const optimisticMessage = {
      _id: Date.now().toString(),
      chatId,
      senderId: session.user.id,
      senderName: session.user.name,
      text: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setTyping(false);    

    if (socket) {
      socket.emit("typing", {
        chatId,
        userId: session.user.id,
        userName: session.user.name,
        isTyping: false,
      });
    }

    try {
      await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          senderName: session.user.name,
          text: newMessage.trim(),
        }),
      });
    } catch (error) {
      console.error("Error saving message via API:", error);
    }
  };

  const handleTyping = () => {
    if (!socket || !session?.user) return;

    socket.emit("typing", {
      chatId,
      userId: session.user.id,
      userName: session.user.name,
      isTyping: true,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (socket)
        socket.emit("typing", {
          chatId,
          userId: session.user.id,
          userName: session.user.name,
          isTyping: false,
        });
    }, 1000);
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const getOtherUser = () => {
    if (!chat) return null;
    return chat.initiatorId === session?.user?.id
      ? { name: chat.skillOwnerName, id: chat.skillOwnerId, isOwner: true }
      : { name: chat.initiatorName, id: chat.initiatorId, isOwner: false };
  };

  const shouldShowDate = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    return (
      new Date(currentMessage.timestamp).toDateString() !==
      new Date(previousMessage.timestamp).toDateString()
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );

  const otherUser = getOtherUser();
  if (!chat)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"></div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-[#020617] relative">
      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>

      {/* Main Chat Area */}
      <div className="flex flex-col w-full max-w-4xl h-[95vh] backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile Back Button */}
            {isMobile && (
              <button
                onClick={() => router.push("/appBar/inbox")}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
            )}

            {/* Desktop Back Button */}
            {!isMobile && (
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    otherUser?.name || "User"
                  }&background=3b82f6&color=fff`}
                  alt={otherUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${
                    isConnected ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>

              <div>
                <h1 className="font-semibold text-white text-lg">
                  {otherUser?.name}
                </h1>
                <p className="text-sm text-gray-300">
                  {isConnected ? "Active now" : "Offline"}
                  {typing && " • Typing..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Phone size={20} className="text-white" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Video size={20} className="text-white" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Info size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <div className="text-3xl">💬</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-300 max-w-md">
                Send a message to begin chatting with {otherUser?.name} about{" "}
                {chat.skillName}
              </p>
              {chat.selectedDate && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-blue-400 bg-blue-900/30 px-4 py-2 rounded-full">
                  <Clock size={16} />
                  <span>
                    Scheduled for{" "}
                    {new Date(chat.selectedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const showDate = shouldShowDate(message, messages[index - 1]);
                const isOwnMessage = message.senderId === session?.user?.id;
                return (
                  <div key={message._id || message.timestamp}>
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <div className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-xs lg:max-w-md ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        } items-end space-x-2`}
                      >
                        {!isOwnMessage && (
                          <img
                            src={`https://ui-avatars.com/api/?name=${message.senderName}&background=3b82f6&color=fff`}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                        <div className="flex flex-col space-y-1">
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-white/20 text-gray-100 rounded-bl-md"
                            }`}
                          >
                            <p className="break-words">{message.text}</p>
                          </div>
                          <div
                            className={`flex items-center space-x-1 text-xs ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span
                              className={
                                isOwnMessage ? "text-blue-300" : "text-gray-400"
                              }
                            >
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwnMessage && (
                              <div
                                className={
                                  message.read
                                    ? "text-blue-300"
                                    : "text-gray-500"
                                }
                              >
                                {message.read ? (
                                  <CheckCheck size={12} />
                                ) : (
                                  <Check size={12} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white/10 backdrop-blur-md border-t border-white/10 p-4">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*,audio/*"
            />
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-300">
              <Smile size={20} />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-300">
              <Image size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="w-full border border-white/20 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-gray-400"
                onKeyPress={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              {!newMessage.trim() && (
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors text-gray-400">
                  <Mic size={20} />
                </button>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full transition-all duration-200 ${
                newMessage.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  : "bg-white/20 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
