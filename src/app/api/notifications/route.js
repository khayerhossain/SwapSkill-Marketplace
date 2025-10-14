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
    
    console.log("Fetching notifications for user:", userId);
    
    const notificationsCollection = await dbConnect(collectionNamesObj.notificationsCollection);
    
    const notifications = await notificationsCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    console.log("Found notifications:", notifications.length);

    return new Response(JSON.stringify({ 
      success: true, 
      notifications: notifications.map(notif => ({
        ...notif,
        _id: notif._id.toString()
      }))
    }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
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
      return new Response(JSON.stringify({ 
        success: false,
        error: "Missing required fields: userId, title, message" 
      }), {
        status: 400,
      });
    }
    
    console.log("Creating notification for user:", userId, "Title:", title);
    
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
    
    console.log("Notification created successfully:", result.insertedId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: { 
          ...newNotification, 
          _id: result.insertedId.toString() 
        } 
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
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
      console.log("Marking all notifications as read for user:", userId);
      const result = await notificationsCollection.updateMany(
        { userId: userId, read: false },
        { $set: { read: true, updatedAt: new Date() } }
      );
      
      console.log("Marked notifications as read:", result.modifiedCount);
      
      return new Response(JSON.stringify({ 
        success: true, 
        modifiedCount: result.modifiedCount 
      }), {
        status: 200,
      });
    } else if (notificationId) {
      // Mark single notification as read
      console.log("Marking notification as read:", notificationId);
      await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true, updatedAt: new Date() } }
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Notification ID or markAll with userId is required" 
      }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
    });
  }
}