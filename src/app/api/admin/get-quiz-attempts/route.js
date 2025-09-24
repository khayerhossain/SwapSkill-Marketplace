import dbConnect, { collectionNamesObj } from '@/lib/db.connect';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);
    const skillsDirectoryCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    // শুধুমাত্র Pending বা Approved AND passed attempts fetch
    const attempts = await testQNACollection
      .find({ 
        type: 'quiz-attempt', 
        status: { $in: ['pending', 'approved'] },
        passed: true   // ✅ added to exclude failed attempts
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate user email/name
    const results = await Promise.all(attempts.map(async (attempt) => {
      let userProfile = null;
      try {
        userProfile = await skillsDirectoryCollection.findOne({ _id: new ObjectId(attempt.profileId) });
      } catch (err) {
        console.error('Invalid profileId:', attempt.profileId);
      }
      return {
        ...attempt,
        userEmail: userProfile?.email || 'N/A',
        userName: userProfile?.name || 'N/A',
      };
    }));

    return Response.json({ success: true, attempts: results });

  } catch (error) {
    console.error('Get attempts error:', error);
    return Response.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
