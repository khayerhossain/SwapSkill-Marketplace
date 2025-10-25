import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function GET() {
  try {
    // Connect to collections
    const usersCollection = await dbConnect(collectionNamesObj.usersCollection);
    const subscribersCollection = await dbConnect(
      collectionNamesObj.newsLatterSubscribersCollection
    );
    const paymentCollection = await dbConnect(
      collectionNamesObj.paymentCollection
    );
    const skillsCollection = await dbConnect(
      collectionNamesObj.skillsDirectoryCollection
    );

    // Count total users
    const totalUsers = await usersCollection.countDocuments();

    // Count total subscribers
    const totalSubscribers = await subscribersCollection.countDocuments();

    // Count total skills
    const totalSkills = await skillsCollection.countDocuments();

    // Calculate total revenue from payment collection
    const payments = await paymentCollection.find({}).toArray();
    const totalRevenue = payments.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    // Build response
    const analytics = {
      totalUsers,
      totalSubscribers,
      totalRevenue,
      totalSkills,
    };

    return new Response(JSON.stringify({ success: true, analytics }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch analytics",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
