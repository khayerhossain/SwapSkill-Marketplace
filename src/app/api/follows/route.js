// src/app/api/follows/route.js

import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function POST(request) {
  try {
    const { userName, followinguserEmail, postId, postEmail } = await request.json();

    if (!userName || !followinguserEmail || !postId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);

    /////// Check if user already followed this post ////////
    const alreadyFollowed = await collection.findOne({ followinguserEmail, postId });
    if (alreadyFollowed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Already followed this post",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } } // 409 = Conflict
      );
    }
    /////// Check if user already followed this post ////////



    const newFollow = {
      userName,
      followinguserEmail,
      postId,
      postEmail,
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
    const result = await collection.deleteOne({ followinguserEmail: email, postId });

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
    const postId = searchParams.get("postId");

    if (!email || !postId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing email or postId" }),
        { status: 400 }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);
    const isFollowing = await collection.findOne({ followinguserEmail: email, postId });

    // Count user posts
    //const count = await collection.countDocuments({ userEmail: email });

    return new Response(
      JSON.stringify({ success: true, isFollowing: !!isFollowing, }),

      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

