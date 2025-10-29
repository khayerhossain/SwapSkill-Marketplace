import { NextResponse } from "next/server";
import dbConnect from "@/lib/db.connect";
import { collectionNamesObj } from "@/lib/db.connect";

export async function GET(request, { params }) {
  try {
    const { category } = params;
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);
    
    const quiz = await testQNACollection.findOne({ 
      category: decodeURIComponent(category) 
    });
    
    if (!quiz) {
      return NextResponse.json({ 
        success: false, 
        error: "Quiz not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: quiz 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}