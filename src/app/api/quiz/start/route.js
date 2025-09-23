import dbConnect, { collectionNamesObj } from '@/lib/db.connect';

export async function POST(request) {
  try {
    const { profileId, userId, category } = await request.json();

    if (!profileId || !userId || !category) {
      return Response.json({ 
        message: 'ProfileId, userId and category are required' 
      }, { status: 400 });
    }

    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);

    // const existingSession = await testQNACollection.findOne({
    //   userId: userId,
    //   profileId: profileId,
    //   type: 'quiz-session',
    //   expiresAt: { $gt: new Date() }
    // });

    // if (existingSession) {
    //   return Response.json({ 
    //     message: 'You already have an active quiz session. Please try again later.' 
    //   }, { status: 400 });
    // }

    const categoryData = await testQNACollection.findOne({ 
      category: category,
      type: { $exists: false }
    });

    if (!categoryData || !categoryData.questions || categoryData.questions.length === 0) {
      return Response.json({ 
        message: 'No questions found for this category' 
      }, { status: 404 });
    }

    const allQuestions = [...categoryData.questions];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(10, allQuestions.length));

    const questionsForClient = selectedQuestions.map((q, index) => ({
      _id: `${category}_${index}_${Date.now()}`,
      question: q.question,
      options: q.options
    }));

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const sessionData = {
      sessionId,
      userId,
      profileId,
      category,
      originalQuestions: selectedQuestions,
      questionsForClient,
      expiresAt,
      createdAt: new Date(),
      type: 'quiz-session'
    };

    await testQNACollection.insertOne(sessionData);

    return Response.json({
      success: true,
      sessionId,
      questions: questionsForClient,
      expiresAt,
      totalQuestions: selectedQuestions.length,
      timeLimit: 30,
      categoryInfo: {
        category: categoryData.category,
        passingScore: categoryData.passingScore || Math.ceil(selectedQuestions.length * 0.7),
        totalMarks: categoryData.totalMarks || selectedQuestions.length
      }
    });

  } catch (error) {
    console.error('Quiz start error:', error);
    return Response.json({ 
      success: false, 
      message: 'Server error occurred',
      error: error.message
    }, { status: 500 });
  }
}