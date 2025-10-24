import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function GET() {
  try {
    const collection = await dbConnect(collectionNamesObj.userEarnCoinCollection);

    // Get all user leaderboard entries
    const result = await collection
      .find({})
      .sort({ coinsEarned: -1 }) // highest first
      .toArray();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch leaderboard",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
