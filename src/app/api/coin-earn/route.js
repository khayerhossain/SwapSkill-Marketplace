import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { getServerSession } from "next-auth";


export async function POST(req) {
  try {
    const body = await req.json();
    const { userEmail, score, coinsEarned } = body;

    if (!userEmail) {
      return new Response(
        JSON.stringify({ success: false, message: "User email is required" }),
        { status: 400 }
      );
    }

   

    // Mongo collection connect
    const userEarnCoinCollection = await dbConnect(
      collectionNamesObj.userEarnCoinCollection
    );

    // Check if user already exists
    const existingUser = await userEarnCoinCollection.findOne({ userEmail });

    let result;

    if (existingUser) {
      // If user exists → update total score & coins
      const updatedScore = existingUser.score + (score || 0);
      const updatedCoins = existingUser.coinsEarned + (coinsEarned || 0);

      result = await userEarnCoinCollection.updateOne(
        { userEmail },
        {
          $set: {
            score: updatedScore,
            coinsEarned: updatedCoins,
            updatedAt: new Date(),
          },
        }
      );

      console.log("User updated:", userEmail);
    } else {
      // First time player → insert new record
      result = await userEarnCoinCollection.insertOne({
        userEmail,
        score: score || 0,
        coinsEarned: coinsEarned || 0,
        createdAt: new Date(),
      });

      console.log("New user inserted:", userEmail);
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}



export async function GET() {
  try {
    // ✅ Get logged-in user info
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return Response.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // ✅ Connect to MongoDB collection
    const userEarnCoinCollection = await dbConnect(
      collectionNamesObj.userEarnCoinCollection
    );

    // ✅ Find only the logged-in user's data
    const userData = await userEarnCoinCollection.findOne({ userEmail });

    if (!userData) {
      return Response.json(
        { success: false, message: "No data found for this user" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

