//src\app\api\saved-skills
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";


// post data

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(" Incoming request to save skill:", body); 

    const { skillData, userEmail } = body;

    if (!skillData || !userEmail) {
      
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing skill data or user email.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.savedSkills);

    const newSavedSkill = {
      ...skillData,
      savedBy: userEmail,
      savedAt: new Date(),
    };

    const result = await collection.insertOne(newSavedSkill);
    console.log(" Skill saved in DB:", result.insertedId); 

    return new Response(
      JSON.stringify({
        success: true,
        message: "Skill saved successfully!",
        id: result.insertedId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
  
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to save skill",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//get data

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.savedSkills);
    const saved = await collection.find({ savedBy: email }).toArray();

    return new Response(
      JSON.stringify({
        success: true,
        count: saved.length,
        savedSkills: saved.map((s) => ({
          ...s,
          _id: s._id.toString(),
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("🔥 Error fetching saved skills:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch saved skills" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//delete  
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Skill ID required" }, { status: 400 });
    }

    const skillsCollection = await dbConnect(collectionNamesObj.savedSkills);
    const result = await skillsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Skill not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Skill removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}