import { Server } from "socket.io";

let io;

export const initSocketIO = (server) => {
  if (io) return io; // Prevent multiple init

  io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join personal room for notifications
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${socket.id} joined personal room: user_${userId}`);
    });

    // Join chat room for 1:1 chat
    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.id} joined chat room: chat_${chatId}`);
    });

    // Send message handler
    socket.on("send_message", async (data) => {
      try {
        const dbModule = await import('./db.connect.js');
        const dbConnect = dbModule.default;

        const messagesCollection = await dbConnect('chat-messages');
        const chatsCollection = await dbConnect('chat-sessions');
        const notificationsCollection = await dbConnect('notifications');

        const messageData = {
          chatId: data.chatId,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: new Date(),
          read: false
        };

        // Save message in DB
        const result = await messagesCollection.insertOne(messageData);
        messageData._id = result.insertedId;

        // Update chat last message
        await chatsCollection.updateOne(
          { _id: new dbModule.ObjectId(data.chatId) },
          {
            $set: {
              lastMessage: data.text,
              lastMessageTime: new Date(),
              updatedAt: new Date()
            }
          }
        );

        // Fetch chat to get receiver
        const chat = await chatsCollection.findOne({ _id: new dbModule.ObjectId(data.chatId) });
        if (!chat) return;

        const receiverId = data.senderId === chat.initiatorId ? chat.skillOwnerId : chat.initiatorId;

        // Create notification for receiver
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

        // Emit message only to the chat room (1:1)
        io.to(`chat_${data.chatId}`).emit("receive_message", messageData);

        // Emit notification to receiver personal room
        io.to(`user_${receiverId}`).emit("new_notification", {
          notificationId: notificationResult.insertedId,
          title: "New Message",
          message: `${data.senderName}: ${data.text.substring(0, 50)}...`,
          type: "chat",
          chatId: data.chatId,
          createdAt: new Date()
        });

      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(`chat_${data.chatId}`).emit("user_typing", {
        userId: data.userId,
        userName: data.userName,
        isTyping: data.isTyping
      });
    });

    // Mark messages as read
    socket.on("mark_messages_read", async (data) => {
      try {
        const dbModule = await import('./db.connect.js');
        const dbConnect = dbModule.default;
        const messagesCollection = await dbConnect('chat-messages');

        await messagesCollection.updateMany(
          { chatId: data.chatId, senderId: { $ne: data.userId }, read: false },
          { $set: { read: true } }
        );
      } catch (error) {
        console.error("Error marking messages read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
