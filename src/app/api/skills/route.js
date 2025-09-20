import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

// POST - Add new skill
export async function POST(req) {
  try {
    const body = await req.json();
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    // Create new profile document
    const newProfile = {
      ...body,
      verification: false, // Initially not verified
      verificationScore: 0,
      quizAttempts: 0,
      badgeType: null,
      lastQuizAt: null,
      verificationPercentage: 0,
      verificationCategory: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await skillsCollection.insertOne(newProfile);

    return Response.json({ 
      success: true,
      message: "Skill added successfully!", 
      profileId: result.insertedId, // Use this ID in quiz page
      insertedId: result.insertedId 
    });

  } catch (error) {
    console.error('Skill addition error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// GET - All skills
export async function GET() {
  try {
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    const skills = await skillsCollection.find().toArray();
    return Response.json(skills);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}