import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

//  GET all skills
export async function GET() {
  try {
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    const skills = await skillsCollection.find({ status: "approved" }).toArray();

    const formatted = skills.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return Response.json(formatted, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


//  PATCH (toggle visibility)
export async function PATCH(req) {
  try {
    const { id, visibility } = await req.json(); // showing/hide
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    await skillsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { visibility } }
    );

    return Response.json({ message: "Skill visibility updated successfully!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Skill ID required" }, { status: 400 });
    }

    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
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
