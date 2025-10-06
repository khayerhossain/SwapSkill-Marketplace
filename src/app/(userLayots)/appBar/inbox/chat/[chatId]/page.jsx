"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
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
  CheckCheck
} from 'lucide-react';

let socket;

export default function ChatPage() {
  const { chatId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize socket connection
    socket = io(process.env.NEXTAUTH_URL || 'http://localhost:3000');
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log("Socket connected");
      
      // Join user's personal room for notifications
      socket.emit('join_user', session.user.id);
      
      // Join chat room
      socket.emit('join_chat', chatId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for new messages
    socket.on('receive_message', (message) => {
      console.log("New message received:", message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      
      // Mark as read if it's the current user's chat
      if (message.senderId !== session?.user?.id) {
        socket.emit('mark_messages_read', {
          chatId: chatId,
          userId: session?.user?.id
        });
      }
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
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
      if (socket) {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('new_notification');
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
      // Load chat details
      const chatResponse = await fetch(`/api/chats/${chatId}`);
      const chatData = await chatResponse.json();
      
      if (chatData.success) {
        setChat(chatData.chat);
      } else {
        console.error("Error loading chat:", chatData.error);
        return;
      }

      // Load messages
      const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
      const messagesData = await messagesResponse.json();
      
      if (messagesData.success) {
        setMessages(messagesData.messages);
        scrollToBottom();
      }

      // Mark messages as read
      if (socket && session?.user?.id) {
        socket.emit('mark_messages_read', {
          chatId: chatId,
          userId: session.user.id
        });
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (newMessage.trim() && socket && session?.user && chat) {
      const messageData = {
        chatId: chatId,
        senderId: session.user.id,
        senderName: session.user.name,
        text: newMessage.trim(),
        receiverId: chat.initiatorId === session.user.id ? chat.skillOwnerId : chat.initiatorId
      };

      console.log("Sending message:", messageData);

      // Send via socket
      socket.emit('send_message', messageData);
      
      // Optimistically add message to UI
      const optimisticMessage = {
        _id: Date.now().toString(),
        chatId: chatId,
        senderId: session.user.id,
        senderName: session.user.name,
        text: newMessage.trim(),
        timestamp: new Date(),
        read: false
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      setTyping(false);
      scrollToBottom();
      
      // Clear typing indicator
      if (socket) {
        socket.emit('typing', {
          chatId: chatId,
          userId: session.user.id,
          userName: session.user.name,
          isTyping: false
        });
      }

      // Also save to database via API (as backup)
      try {
        await fetch(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: session.user.id,
            senderName: session.user.name,
            text: newMessage.trim()
          })
        });
      } catch (error) {
        console.error('Error saving message via API:', error);
      }
    }
  };

  const handleTyping = () => {
    if (socket && session?.user) {
      socket.emit('typing', {
        chatId: chatId,
        userId: session.user.id,
        userName: session.user.name,
        isTyping: true
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (socket) {
          socket.emit('typing', {
            chatId: chatId,
            userId: session.user.id,
            userName: session.user.name,
            isTyping: false
          });
        }
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getOtherUser = () => {
    if (!chat) return null;
    return chat.initiatorId === session?.user?.id 
      ? { 
          name: chat.skillOwnerName, 
          id: chat.skillOwnerId,
          isOwner: true
        }
      : { 
          name: chat.initiatorName, 
          id: chat.initiatorId,
          isOwner: false
        };
  };

  const shouldShowDate = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading chat...</p>
  //       </div>
  //     </div>
  //   );
  // }

    const otherUser = getOtherUser();

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 flex ">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-lg border border-gray-200">
        {/* Header - Messenger Style */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${otherUser?.name || 'User'}&background=007bff&color=fff`}
                  alt={otherUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div>
                <h1 className="font-semibold text-gray-800 text-lg">
                  {otherUser?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {isConnected ? 'Active now' : 'Offline'}
                  {typing && ' • Typing...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Info size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <div className="text-3xl">💬</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Send a message to begin chatting with {otherUser?.name} about {chat.skillName}
              </p>
              {chat.selectedDate && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  <Clock size={16} />
                  <span>Scheduled for {new Date(chat.selectedDate).toLocaleDateString()}</span>
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
                    {/* Date Separator */}
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                        {/* Avatar for received messages */}
                        {!isOwnMessage && (
                          <img
                            src={`https://ui-avatars.com/api/?name=${message.senderName}&background=007bff&color=fff`}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex flex-col space-y-1">
                          {/* Sender name for group chats - hidden for 1:1 */}
                          
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-gray-200 text-gray-800 rounded-bl-md'
                            }`}
                          >
                            <p className="break-words">{message.text}</p>
                          </div>
                          
                          {/* Message time and status */}
                          <div className={`flex items-center space-x-1 text-xs ${
                            isOwnMessage ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className={isOwnMessage ? 'text-blue-300' : 'text-gray-500'}>
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwnMessage && (
                              <div className={message.read ? 'text-blue-300' : 'text-gray-400'}>
                                {message.read ? <CheckCheck size={12} /> : <Check size={12} />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${otherUser?.name}&background=007bff&color=fff`}
                      alt={otherUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input Area - Messenger Style */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            {/* Attachment Button */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
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
            
            {/* Emoji Button */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <Smile size={20} />
            </button>
            
            {/* Image Button */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <Image size={20} />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="w-full border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />
              
              {/* Voice Message Button */}
              {!newMessage.trim() && (
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <Mic size={20} />
                </button>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full transition-all duration-200 ${
                newMessage.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          
          {/* Schedule Info */}
          {chat.selectedDate && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                <Clock size={12} />
                <span>Scheduled for {new Date(chat.selectedDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}