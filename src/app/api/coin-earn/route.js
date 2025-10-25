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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Mongo collection connect
    const userEarnCoinCollection = await dbConnect(
      collectionNamesObj.userEarnCoinCollection
    );

    // Find user by email
    const user = await userEarnCoinCollection.findOne({ 
      userEmail: session.user.email 
    });

    if (!user) {
      // Return default values if user doesn't exist
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { 
            userEmail: session.user.email,
            score: 0,
            coinsEarned: 0,
            createdAt: new Date()
          } 
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: user }),
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

