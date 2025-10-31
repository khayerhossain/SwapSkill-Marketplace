import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { ObjectId } from "mongodb";

// GET all users

export async function GET(request) {
  try {
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);

    //  Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; 
    const limit = parseInt(searchParams.get("limit")) || 10; 

    const skip = (page - 1) * limit;

    //  Count total users for pagination info
    const totalUsers = await usersCollection.countDocuments();

    //  Fetch paginated users
    const users = await usersCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    const formatted = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    //  Return paginated data with meta info
    return Response.json(
      {
        success: true,
        users: formatted,
        pagination: {
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}




// PATCH (update user status)
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);

    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    return Response.json({ message: "Status updated successfully!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
      { message: "User removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
