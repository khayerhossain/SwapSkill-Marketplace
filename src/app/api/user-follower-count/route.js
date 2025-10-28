
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    const collection = await dbConnect(collectionNamesObj.followCollection);

    // Count user posts
    const count = await collection.countDocuments({ postEmail: email });

    return new Response(
      JSON.stringify({ success: true, totalPosts: count }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
