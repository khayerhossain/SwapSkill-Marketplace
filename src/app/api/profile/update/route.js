import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db.connect";
import { collectionNamesObj } from "@/lib/db.connect";

export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, skills, contactInfo } = await request.json();
    
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    
    const updateData = {
      name: name.trim(),
      ...(bio !== undefined && { bio }),
      ...(skills !== undefined && { skills }),
      ...(contactInfo !== undefined && { contactInfo }),
      updatedAt: new Date()
    };

    const result = await usersCollection.updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Profile update failed" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully" 
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileData = {
      name: user.name || "",
      email: user.email,
      bio: user.bio || "",
      skills: user.skills || [],
      contactInfo: user.contactInfo || {},
      profileImage: user.profileImage || "",
      role: user.role || "user",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(profileData);

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}