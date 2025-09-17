import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

//  Subscriber Create
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" });
    }

    const collection = await dbConnect(
      collectionNamesObj.newsLatterSubscribersCollection
    );

    // already exists কিনা চেক
    const existing = await collection.findOne({ email });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Email already subscribed",
      });
    }

    const subscriber = {
      email,
      name: "Guest User",
      image: "https://i.pravatar.cc/100",
      createdAt: new Date(),
      note: "Subscribed from newsletter form",
    };

    await collection.insertOne(subscriber);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("POST /api/subscribers error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

//  Subscriber List
export async function GET() {
  try {
    const collection = await dbConnect(
      collectionNamesObj.newsLatterSubscribersCollection
    );
    const subscribers = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, subscribers });
  } catch (err) {
    console.error("GET /api/subscribers error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

//  Subscriber Remove
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" });
    }

    const collection = await dbConnect(
      collectionNamesObj.newsLatterSubscribersCollection
    );

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Subscriber removed" });
  } catch (err) {
    console.error("DELETE /api/subscribers error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}