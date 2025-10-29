import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { chatId } = params;
    
    const messagesCollection = await dbConnect(collectionNamesObj.chatMessagesCollection);
    
    const messages = await messagesCollection
      .find({ chatId: chatId })
      .sort({ timestamp: 1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, messages }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request, { params }) {
  try {
    const { chatId } = params;
    const body = await request.json();
    
    const messagesCollection = await dbConnect(collectionNamesObj.chatMessagesCollection);
    
    const message = {
      chatId: chatId,
      senderId: body.senderId,
      senderName: body.senderName,
      text: body.text,
      timestamp: new Date(),
      read: false
    };

    const result = await messagesCollection.insertOne(message);

    // Update chat session
    const chatsCollection = await dbConnect(collectionNamesObj.chatSessionsCollection);
    await chatsCollection.updateOne(
      { _id: new ObjectId(chatId) },
      { 
        $set: { 
          lastMessage: body.text,
          lastMessageTime: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: { ...message, _id: result.insertedId } 
      }), 
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}