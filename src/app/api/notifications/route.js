import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

// GET - User এর notifications fetch করা
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
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }
    
    const notificationsCollection = await dbConnect(collectionNamesObj.notificationsCollection);
    
    const notifications = await notificationsCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return new Response(JSON.stringify({ success: true, notifications }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST - New notification তৈরি করা
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { userId, title, message, type, chatId, relatedId } = body;
    
    if (!userId || !title || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }
    
    const notificationsCollection = await dbConnect(collectionNamesObj.notificationsCollection);
    
    const newNotification = {
      userId: userId,
      title: title,
      message: message,
      type: type || "info",
      chatId: chatId || null,
      relatedId: relatedId || null,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await notificationsCollection.insertOne(newNotification);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: { ...newNotification, _id: result.insertedId } 
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// PUT - Notification read mark করা
export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { notificationId, markAll, userId } = body;
    
    const notificationsCollection = await dbConnect(collectionNamesObj.notificationsCollection);
    
    if (markAll && userId) {
      // Mark all notifications as read for user
      const result = await notificationsCollection.updateMany(
        { userId: userId, read: false },
        { $set: { read: true, updatedAt: new Date() } }
      );
      
      return new Response(JSON.stringify({ 
        success: true, 
        modifiedCount: result.modifiedCount 
      }), {
        status: 200,
      });
    } else if (notificationId) {
      // Mark single notification as read
      await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true, updatedAt: new Date() } }
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "Notification ID or markAll with userId is required" }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}