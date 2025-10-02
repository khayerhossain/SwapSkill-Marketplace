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
    const payments = await paymentCollection.find({
      email: session.user.email,
      status: "success", // jodi status field thake
    }).toArray();

    // Calculate total price
    const totalAmount = payments.reduce(
  (sum, p) => sum + Number(p.price || 0), 
  0
);

    // Count by paymentMethod
    const stripeCount = payments.filter(p => p.paymentMethod === "stripe").length;
    const sslCount = payments.filter(p => p.paymentMethod === "sllcoommerz").length;

    return new Response(
      JSON.stringify({ 
        totalAmount, 
        stripeCount, 
        sslCount, 
        payments 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
