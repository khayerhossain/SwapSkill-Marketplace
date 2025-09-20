import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

// POST - Add new skill
export async function POST(req) {
  try {
    const body = await req.json();
    const skillsCollection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );

    // Convert comma separated strings to arrays
    const skillsToTeachArray = body.skillsToTeach
      ? body.skillsToTeach.split(",").map((s) => s.trim())
      : [];
    const skillsToLearnArray = body.skillsToLearn
      ? body.skillsToLearn.split(",").map((s) => s.trim())
      : [];
    const languagesArray = body.languages
      ? body.languages.split(",").map((s) => s.trim())
      : [];
    const tagsArray = body.tags
      ? body.tags.split(",").map((s) => s.trim())
      : [];

    // Create new profile document
    const newProfile = {
      userName: body.userName,
      age: body.age || null,
      gender: body.gender || null,
      homeTown: body.homeTown || null,
      studyOrWorking: body.studyOrWorking || null,
      userImage: body.userImage || null,
      category: body.category || null,
      description: body.description || null,
      experience: body.experience || null,
      availability: body.availability || null,
      availabilityType: body.availabilityType || null,
      location: body.location || null,
      timeZone: body.timeZone || null,
      swapPreference: body.swapPreference || null,
      portfolioLink: body.portfolioLink || null,
      responseTime: body.responseTime || null,

      // Arrays
      skillsToTeach: skillsToTeachArray,
      skillsToLearn: skillsToLearnArray,
      languages: languagesArray,
      tags: tagsArray,

      // Contact Info
      contactInfo: {
        email: body.email || null,
        phone: body.phone || null,
      },

      // Social Media
      socialMedia: {
        facebook: body.facebook || null,
        instagram: body.instagram || null,
        twitter: body.twitter || null,
      },

      // Collaboration Price (defaults for perHour + negotiable)
      collaborationPrice: {
        currency: body.priceCurrency || "USD",
        perHour: 0,
        negotiable: true,
      },

      // Default values
      rating: 0,
      reviewsCount: 0,
      verification: false,
      verificationScore: 0,
      badgeType: null,
      quizAttempts: 0,
      lastQuizAt: null,
      verificationPercentage: 0,
      verificationCategory: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await skillsCollection.insertOne(newProfile);

    return Response.json({
      success: true,
      message: "Skill added successfully!",
      profileId: result.insertedId,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Skill addition error:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET - All skills
export async function GET() {
  try {
    const skillsCollection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );
    const skills = await skillsCollection.find().toArray();
    return Response.json(skills);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
