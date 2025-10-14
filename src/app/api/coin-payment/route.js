import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, price, } = body;
      




    const coinNeeded = price * 10;

    // Connect collections
    const userEarnCoinCollection = await dbConnect(
      collectionNamesObj.userEarnCoinCollection
    );
    const paymentCollection = await dbConnect(
      collectionNamesObj.paymentCollection
    );

    // Find user by email
    const user = await userEarnCoinCollection.findOne({ userEmail: email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    console.log("User found:", user.userEmail, "Coins:", user.coinsEarned);

    // Check if user has enough coins
    if (user.coinsEarned < coinNeeded) {
      return NextResponse.json(
        { success: false, message: "You don't have enough coins." },
        { status: 400 }
      );
    }

    // Deduct coins
    const newCoinBalance = user.coinsEarned - coinNeeded;

    const updateResult = await userEarnCoinCollection.updateOne(
      { userEmail: email },
      { $set: { coinsEarned: newCoinBalance } }
    );

    console.log("Coin update result:", updateResult);

    // Insert payment data into payment collection
    await paymentCollection.insertOne(body);

    return NextResponse.json(
      {
        success: true,
        message: "Payment successful! Coins deducted successfully.",
        newCoinBalance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Coin Payment Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred during coin payment.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
