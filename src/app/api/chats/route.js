import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    
    const chatsCollection = await dbConnect(collectionNamesObj.chatSessionsCollection);
    
    const chats = await chatsCollection
      .find({
        $or: [
          { initiatorId: userId },
          { skillOwnerId: userId }
        ]
      })
      .sort({ updatedAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, chats }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { skillId, skillOwnerId, selectedDate } = body;

    const chatsCollection = await dbConnect(collectionNamesObj.chatSessionsCollection);
    
    // Check if chat already exists
    const existingChat = await chatsCollection.findOne({
      skillId: skillId,
      initiatorId: session.user.id,
      skillOwnerId: skillOwnerId
    });

    if (existingChat) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          chatId: existingChat._id,
          existing: true 
        }), 
        { status: 200 }
      );
    }

    // Get skill details
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    const skill = await skillsCollection.findOne({ _id: new ObjectId(skillId) });

    // Create new chat session
    const newChat = {
      skillId: skillId,
      skillName: skill.skillName || skill.category,
      skillOwnerId: skillOwnerId,
      skillOwnerName: skill.userName,
      initiatorId: session.user.id,
      initiatorName: session.user.name,
      selectedDate: selectedDate,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null,
      lastMessageTime: null
    };

    const result = await chatsCollection.insertOne(newChat);

    // Create notification for skill owner
    const notificationsCollection = await dbConnect(collectionNamesObj.notificationsCollection);
    await notificationsCollection.insertOne({
      userId: skillOwnerId,
      title: "New Chat Request",
      message: `${session.user.name} wants to chat about ${skill.skillName || skill.category}`,
      type: "chat",
      chatId: result.insertedId,
      read: false,
      createdAt: new Date()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        chatId: result.insertedId,
        existing: false 
      }), 
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}