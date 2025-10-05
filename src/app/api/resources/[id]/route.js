import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";



//  Like / Share / Comment / Save 

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const collection = await dbConnect(collectionNamesObj.resourcesCollection);

    const { action, userEmail, userName, commentText } = body;
    let update = {};

    if (action === "like") {
      update = { $inc: { likes: 1 }, $addToSet: { likedBy: userEmail } };
    } 
    else if (action === "comment") {
      if (!commentText || !commentText.trim()) {
        return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
      }

      const commentObj = {
        userName: userName || "Guest",
        text: commentText, 
        createdAt: new Date(),
      };
      update = { $push: { comments: commentObj } };
    } 
    else if (action === "share") {
      update = { $inc: { shares: 1 } };
    } 
    else if (action === "save") {
      const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
      await usersCollection.updateOne(
        { email: userEmail },
        { $addToSet: { savedPosts: id } },
        { upsert: true }
      );
      return NextResponse.json({ saved: true });
    } 
    else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, update);
    return NextResponse.json({ updated: result.modifiedCount > 0 });
  } catch (err) {
    console.error("PATCH /api/resources/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



//  Delete resource
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect(collectionNamesObj.resourcesCollection);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ deleted: result.deletedCount > 0 });
  } catch (err) {
    console.error("DELETE /api/resources/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
