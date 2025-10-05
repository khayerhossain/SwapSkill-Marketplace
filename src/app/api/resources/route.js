// app/api/resources/route.js
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const collection = await dbConnect(collectionNamesObj.resourcesCollection);
    const resources = await collection.find().sort({ createdAt: -1 }).toArray();
    // convert ObjectId to string for client
    const formatted = resources.map((r) => ({ ...r, _id: r._id.toString() }));
    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/resources error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const collection = await dbConnect(collectionNamesObj.resourcesCollection);

    let mediaData = null;
    // if frontend passed base64 string, upload to Cloudinary
    if (body.media?.base64) {
      const uploadResult = await cloudinary.uploader.upload(body.media.base64, {
        resource_type: body.media.type === "video" ? "video" : "image",
        folder: "resources",
      });
      mediaData = { url: uploadResult.secure_url, type: body.media.type };
    }

    const newResource = {
     // userId: body.userId ? new ObjectId(body.userId) : null,
      userEmail: body.userEmail || null,
      userName: body.userName || "Guest User",
      userAvatar: body.userAvatar || null,
      title: body.title || "",
      //tags: body.tags || ["General"],
      media: mediaData,
      likes: 0,
      comments: [], 
      shares: 0,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newResource);
    return NextResponse.json({ insertedId: result.insertedId.toString() });
  } catch (err) {
    console.error("POST /api/resources error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
