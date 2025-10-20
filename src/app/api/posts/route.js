

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

// GET — Fetch all posts or posts by user
export async function GET(req) {
  try {
    const collection = await dbConnect(collectionNamesObj.postsCollection);

    // Get userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If userId is provided, filter posts for that user
    const filter = userId ? { "user.id": userId } : {};

    const posts = await collection.find(filter).toArray();

    console.log("Fetched posts:", posts); 
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST — Create new post
export async function POST(req) {
  try {
    const body = await req.json();
    const collection = await dbConnect(collectionNamesObj.postsCollection);

    const newPost = {
      ...body,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newPost);
    return NextResponse.json({ ...newPost, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE — Delete own post only
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId)
      return NextResponse.json(
        { error: "Missing post ID or user ID" },
        { status: 400 }
      );

    const collection = await dbConnect(collectionNamesObj.postsCollection);
    const post = await collection.findOne({ _id: new ObjectId(id) });

    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.user.id !== userId)
      return NextResponse.json(
        { error: "You can only delete your own post" },
        { status: 403 }
      );

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// PATCH — Like / Comment Add / Edit / Delete
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");
    if (!postId)
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });

    const body = await req.json();
    const collection = await dbConnect(collectionNamesObj.postsCollection);
    const post = await collection.findOne({ _id: new ObjectId(postId) });

    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    let updatedFields = {};

    // Like Update
    if (body.likes) updatedFields.likes = body.likes;

    // Add Comment
    if (body.comment)
      updatedFields.comments = [...(post.comments || []), body.comment];

    // Delete Comment
    if (body.deleteCommentId)
      updatedFields.comments =
        post.comments?.filter((c) => c.id !== body.deleteCommentId) || [];

    // Edit Comment
    if (body.editCommentId && body.text)
      updatedFields.comments =
        post.comments?.map((c) =>
          c.id === body.editCommentId ? { ...c, text: body.text } : c
        ) || [];

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    return NextResponse.json(result.value);
  } catch (err) {
    console.error("PATCH Error:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
