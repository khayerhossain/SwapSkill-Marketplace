import dbConnect, { collectionNamesObj } from "@/lib/db.connect";


// POST New skill add
export async function POST(req) {
  try {
    const body = await req.json();
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    const result = await skillsCollection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return Response.json({ message: "Skill added successfully!", result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET All skills
export async function GET() {
  try {
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    const skills = await skillsCollection.find().toArray();
    return Response.json(skills);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
