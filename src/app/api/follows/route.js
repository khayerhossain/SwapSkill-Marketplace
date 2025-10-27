// src/app/api/follows/route.js

import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function POST(request) {
  try {
    const { userName, userEmail, postId } = await request.json();

    if (!userName || !userEmail || !postId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);

    const newFollow = {
      userName,
      userEmail,
      postId,
      followedAt: new Date(),
    };

    await collection.insertOne(newFollow);

    return new Response(
      JSON.stringify({ success: true, message: "Followed successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const postId = searchParams.get("postId");

    if (!email || !postId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);
    const result = await collection.deleteOne({ userEmail: email, postId });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Unfollowed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);

    // Count user posts
    const count = await collection.countDocuments({ userEmail: email });

    return new Response(
      JSON.stringify({ success: true, totalPosts: count }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
