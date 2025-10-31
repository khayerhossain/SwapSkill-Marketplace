import { NextResponse } from "next/server";
import dbConnect from "@/lib/db.connect";
import { collectionNamesObj } from "@/lib/db.connect";

export async function GET() {
  try {
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);
    const quizzes = await testQNACollection.find({}).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: quizzes 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}