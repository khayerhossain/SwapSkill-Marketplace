import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { chatId } = params;
    
    const chatsCollection = await dbConnect(collectionNamesObj.chatSessionsCollection);
    const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });

    if (!chat) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, chat }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}