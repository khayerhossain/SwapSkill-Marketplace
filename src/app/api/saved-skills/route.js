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
      saveId: skillData._id,
      _id: undefined,
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
    console.error("Error fetching saved skills:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch saved skills",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// delete saved skill from saved skills collection
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Skill ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(collectionNamesObj.savedSkills);

    // Try delete as ObjectId first
    let result;
    if (ObjectId.isValid(id)) {
      result = await collection.deleteOne({ _id: new ObjectId(id) });
    }

    // If no match, try plain string
    if (!result || result.deletedCount === 0) {
      result = await collection.deleteOne({ _id: id });
    }

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Skill not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Skill removed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete skill",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
