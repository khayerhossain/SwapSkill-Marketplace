import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params; // dynamic id from URL
    const collection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    const skill = await collection.findOne({ _id: new ObjectId(id) });

    if (!skill) {
      return new Response(JSON.stringify({ error: "Skill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(skill), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
