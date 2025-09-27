import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

// GET /api/find-skills?search=react&page=1&limit=10&sort=newest
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const sortParam = url.searchParams.get("sort") || "newest";

    const collection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );

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
            ],
          },
        ],
      };
    }

    // Sorting
    const sort = sortParam === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // Pagination
    const skip = (page - 1) * limit;
    const total = await collection.countDocuments(query);
    const skills = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return new Response(
      JSON.stringify({
        skills,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST - Add new skill
export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );

    // createdAt auto add 
    const newSkill = {
      ...body,
      verification: false, // unverified
      status: "pending",   // pending
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newSkill);

    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT - Admin approve skill
export async function PUT(request) {
  try {
    const { id, approve } = await request.json(); // approve = true/false
    const collection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          verification: approve,
          status: approve ? "approved" : "pending",
        },
      }
    );

    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
