import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function POST(req) {
  try {
    const body = await req.json();
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    const skillsToTeachArray = body.skillsToTeach ? body.skillsToTeach.split(",").map(s => s.trim()) : [];
    const skillsToLearnArray = body.skillsToLearn ? body.skillsToLearn.split(",").map(s => s.trim()) : [];
    const languagesArray = body.languages ? body.languages.split(",").map(s => s.trim()) : [];
    const tagsArray = body.tags || []; // 🔹 UPDATED

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
      availabilityDates: body.availabilityDates || [], // 🔹 UPDATED
      tags: tagsArray, // 🔹 UPDATED

      contactInfo: {
        email: body.email || null, // 🔹 UPDATED
        phone: body.phone || null,
      },

      socialMedia: {
        facebook: body.facebook || null,
        instagram: body.instagram || null,
        twitter: body.twitter || null,
      },

      collaborationPrice: {
        negotiable: true,
      },

      rating: 0,
      reviewsCount: 0,
      verification: false,
      verificationScore: 0,
      badgeType: null,
      quizAttempts: 0,
      lastQuizAt: null,
      verificationPercentage: 0,
      verificationCategory: null,
      status: "pending",
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
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const skillsCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    const skills = await skillsCollection.find().toArray();
    return Response.json(skills);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
