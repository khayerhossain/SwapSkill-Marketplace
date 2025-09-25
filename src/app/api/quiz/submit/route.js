import dbConnect, { collectionNamesObj } from '@/lib/db.connect';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { sessionId, profileId, answers, timeTakenSec } = await request.json();

    if (!sessionId || !profileId || !answers) {
      return Response.json({ 
        message: 'SessionId, profileId and answers are required' 
      }, { status: 400 });
    }

    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);

    const session = await testQNACollection.findOne({
      sessionId: sessionId,
      type: 'quiz-session',
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return Response.json({ 
        message: 'Invalid or expired quiz session' 
      }, { status: 400 });
    }

    const originalQuestions = session.originalQuestions;
    
    if (!originalQuestions || originalQuestions.length === 0) {
      return Response.json({ 
        message: 'Quiz questions not found' 
      }, { status: 400 });
    }

    let correctAnswers = 0;
    const detailedAnswers = [];

    answers.forEach((userAnswer, index) => {
      const question = originalQuestions[index];
      if (question) {
        const isCorrect = question.correctAnswer === userAnswer.selectedIndex;
        if (isCorrect) correctAnswers++;
        
        detailedAnswers.push({
          questionIndex: index,
          question: question.question,
          selectedIndex: userAnswer.selectedIndex,
          correctAnswer: question.correctAnswer,
          correct: isCorrect
        });
      }
    });

    const categoryData = await testQNACollection.findOne({ 
      category: session.category,
      type: { $exists: false }
    });
    
    const totalQuestions = originalQuestions.length;
    const score = correctAnswers;
    const passingScore = categoryData?.passingScore || Math.ceil(totalQuestions * 0.7);
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= passingScore;

    let badgeType = null;
    if (passed) {
      if (percentage >= 90) badgeType = 'Gold';
      else if (percentage >= 80) badgeType = 'Silver'; 
      else if (percentage >= 70) badgeType = 'Bronze';
    }

    // Profile ObjectId
    let profileObjectId;
    try {
      profileObjectId = ObjectId.isValid(profileId) ? new ObjectId(profileId) : profileId;
    } catch (e) {
      profileObjectId = profileId;
    }

    // ✅ Note: verification update removed
    const attemptLog = {
      type: 'quiz-attempt',
      profileId,
      userId: session.userId,
      sessionId,
      category: session.category,
      score,
      totalQuestions,
      percentage,
      passed,
      badgeType,
      timeTakenSec: timeTakenSec || 0,
      answers: detailedAnswers,
      status: 'pending', // admin approval needed
      createdAt: new Date()
    };

    await testQNACollection.insertOne(attemptLog);

    // Remove session after attempt
    await testQNACollection.deleteOne({ 
      sessionId: sessionId, 
      type: 'quiz-session' 
    });

    const message = passed 
      ? `Congratulations! You scored ${score}/${totalQuestions} and earned a ${badgeType} badge!`
      : `You scored ${score}/${totalQuestions}. You needed ${passingScore}+ to pass. Please try again!`;

    return Response.json({
      success: true,
      result: {
        score,
        totalQuestions,
        percentage,
        passed,
        badgeType,
        message,
        verified: false, // still false until admin approves
        passingScore,
      }
    });

  } catch (error) {
    console.error('Quiz submit error:', error);
    return Response.json({ 
      success: false, 
      message: 'Server error occurred',
      error: error.message
    }, { status: 500 });
  }
}
