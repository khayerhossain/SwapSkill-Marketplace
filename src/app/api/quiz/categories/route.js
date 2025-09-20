import dbConnect, { collectionNamesObj } from '@/lib/db.connect';

export async function GET() {
  try {
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);
    
    const categories = await testQNACollection.find({
      category: { $exists: true, $ne: "" },
      type: { $exists: false },
      questions: { $exists: true, $not: { $size: 0 } }
    }).toArray();

    const categoriesInfo = categories.map(cat => ({
      category: cat.category,
      totalQuestions: cat.questions ? cat.questions.length : 0,
      totalMarks: cat.totalMarks || (cat.questions ? cat.questions.length : 0),
      passingScore: cat.passingScore || Math.ceil((cat.questions ? cat.questions.length : 0) * 0.7),
      passingPercentage: Math.round(((
        cat.passingScore || Math.ceil((cat.questions ? cat.questions.length : 0) * 0.7)
      ) / (cat.totalMarks || (cat.questions ? cat.questions.length : 0))) * 100)
    }));

    return Response.json({
      success: true,
      categories: categoriesInfo,
      total: categoriesInfo.length
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    return Response.json({ 
      success: false, 
      message: 'Server error occurred',
      error: error.message
    }, { status: 500 });
  }
}