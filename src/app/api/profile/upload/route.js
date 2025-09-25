import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db.connect";
import { collectionNamesObj } from "@/lib/db.connect";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('profileImage');

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: "Please select a valid image file" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size should be less than 5MB" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads/profiles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${session.user.email}-${timestamp}.jpg`;
    const filepath = join(uploadsDir, filename);

    // Save file to filesystem
    try {
      await writeFile(filepath, buffer);
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json({ error: "Error saving image file" }, { status: 500 });
    }

    // Image URL that will be accessible from the browser
    const imageUrl = `/uploads/profiles/${filename}`;

    // Save image URL to database
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    
    const result = await usersCollection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          profileImage: imageUrl,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Profile image update failed" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: "Profile image updated successfully" 
    });

  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optional: GET method to check current profile image
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

    return NextResponse.json({ 
      profileImage: user.profileImage || "" 
    });

  } catch (error) {
    console.error("Profile image fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}