import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

// GET /api/find-skills?search=react&page=1&limit=10&sort=newest
export async function GET(request) {
  try {
    console.log("Find skills API called");
    
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const sortParam = url.searchParams.get("sort") || "newest";

    console.log("Search params:", { search, page, limit, sortParam });

    const collection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    console.log("Database connected successfully");

    // Base query: must be verified & approved
    let query = { verification: true, status: "approved" };

    // If search query exists, merge it with verification & status
    if (search) {
      query = {
        $and: [
          { verification: true, status: "approved" },
          {
            $or: [
              { skillName: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
              { tags: { $regex: search, $options: "i" } },
              { userName: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } }
            ],
          },
        ],
      };
    }

    console.log("Final query:", JSON.stringify(query));

    // Sorting
    const sort = sortParam === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // Pagination
    const skip = (page - 1) * limit;
    
    console.log("Counting documents...");
    const total = await collection.countDocuments(query);
    console.log("Total documents:", total);
    
    console.log("Fetching skills...");
    const skills = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log("Skills found:", skills.length);

    return new Response(
      JSON.stringify({
        success: true,
        skills,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        } 
      }
    );
  } catch (error) {
    console.error("Error in find-skills API:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "Failed to fetch skills" 
      }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST - Add new skill
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Creating new skill:", body);
    
    const collection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    // createdAt auto add 
    const newSkill = {
      ...body,
      verification: false, // unverified
      status: "pending",   // pending
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newSkill);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.insertedId,
        message: "Skill added successfully" 
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "Failed to create skill" 
      }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}