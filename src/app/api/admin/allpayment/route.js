import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    // Connect to DB

    const paymentCollection = await dbConnect(
      collectionNamesObj.paymentCollection
    );

    // Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Fetch user-specific successful payments
    const payments = await paymentCollection.find({status:'success'}).toArray();

    return new Response(JSON.stringify({ payments }), { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
