import { Server } from "socket.io";

let io;

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User তাদের নিজের room এ join করবে
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${socket.id} joined user room: user_${userId}`);
    });

    // Join a chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    // Handle sending messages - FIXED NOTIFICATION
    socket.on("send_message", async (data) => {
      try {
        // Dynamic import for MongoDB
        const dbModule = await import('./db.connect.js');
        const dbConnect = dbModule.default;
        const collectionNamesObj = dbModule.collectionNamesObj;

        const messagesCollection = await dbConnect('chat-messages');
        
        const messageData = {
          chatId: data.chatId,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: new Date(),
          read: false
        };

        const result = await messagesCollection.insertOne(messageData);
        messageData._id = result.insertedId;

        // Update chat session last message
        const sessionsCollection = await dbConnect('chat-sessions');
        await sessionsCollection.updateOne(
          { _id: data.chatId },
          { 
            $set: { 
              lastMessage: data.text,
              lastMessageTime: new Date(),
              updatedAt: new Date()
            } 
          }
        );

        // Get chat details for notification
        const chat = await sessionsCollection.findOne({ _id: data.chatId });
        if (!chat) {
          console.error("Chat not found for notification");
          return;
        }

        // Determine receiver ID
        const receiverId = data.senderId === chat.initiatorId ? chat.skillOwnerId : chat.initiatorId;
        const receiverName = data.senderId === chat.initiatorId ? chat.skillOwnerName : chat.initiatorName;

        console.log("Sending notification to:", receiverId);

        // Create notification in database
        const notificationsCollection = await dbConnect('notifications');
        const notificationResult = await notificationsCollection.insertOne({
          userId: receiverId,
          title: "New Message",
          message: `${data.senderName}: ${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}`,
          type: "chat",
          chatId: data.chatId,
          relatedId: data.senderId,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Broadcast message to chat room
        io.to(data.chatId).emit("receive_message", messageData);
        
        // Send real-time notification to receiver
        io.to(`user_${receiverId}`).emit("new_notification", {
          notificationId: notificationResult.insertedId,
          title: "New Message",
          message: `${data.senderName}: ${data.text.substring(0, 50)}...`,
          type: "chat",
          chatId: data.chatId,
          createdAt: new Date()
        });

        console.log("Notification sent successfully to user:", receiverId);

      } catch (error) {
        console.error("Error sending message and notification:", error);
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("user_typing", {
        userId: data.userId,
        userName: data.userName,
        isTyping: data.isTyping
      });
    });

    // Handle message read status
    socket.on("mark_messages_read", async (data) => {
      try {
        const dbModule = await import('./db.connect.js');
        const dbConnect = dbModule.default;

        const messagesCollection = await dbConnect('chat-messages');
        
        await messagesCollection.updateMany(
          { 
            chatId: data.chatId, 
            senderId: { $ne: data.userId },
            read: false 
          },
          { $set: { read: true } }
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};