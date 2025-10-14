import dbConnect, { collectionNamesObj } from '@/lib/db.connect';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);
    const skillsDirectoryCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);

    // Fetch only pending or approved AND passed attempts
    const attempts = await testQNACollection
      .find({ 
        type: 'quiz-attempt', 
        status: { $in: ['pending', 'approved'] },
        passed: true
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Attach user profile info to each attempt
    const results = await Promise.all(attempts.map(async (attempt) => {
      let userProfile = null;
      try {
        userProfile = await skillsDirectoryCollection.findOne({ _id: new ObjectId(attempt.profileId) });
      } catch (err) {
        console.error('Invalid profileId:', attempt.profileId);
      }
      return {
        ...attempt,        
        userName: userProfile?.userName || 'N/A',
        userImage: userProfile?.userImage || 'N/A',
        verificationStatus: userProfile?.verification || false,
        lastAttemptStatus: userProfile?.lastAttemptStatus || 'N/A'
      };
    }));

    return Response.json({ success: true, attempts: results });

  } catch (error) {
    console.error('Get attempts error:', error);
    return Response.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { profileId, attemptId, action } = await request.json();

    if (!profileId || !attemptId || !action) {
      return Response.json(
        { success: false, message: 'profileId, attemptId and action are required' },
        { status: 400 }
      );
    }

    const skillsDirectoryCollection = await dbConnect(collectionNamesObj.skillsDirectoryCollection);
    const testQNACollection = await dbConnect(collectionNamesObj.testQNACollection);

    let profileObjectId;
    try {
      profileObjectId = ObjectId.isValid(profileId) ? new ObjectId(profileId) : profileId;
    } catch (e) {
      profileObjectId = profileId;
    }

    // Approve / Reject / View logic
    if (action === 'approve') {
      // ✅ Update verification in skillsDirectoryCollection
      await skillsDirectoryCollection.updateOne(
        { _id: profileObjectId },
        { $set: { verification: true, verifiedAt: new Date(), status: 'approved' } }
      );

      // ✅ Update attempt status in testQNACollection (main content unchanged)
      await testQNACollection.updateOne(
        { _id: new ObjectId(attemptId) },
        { $set: { status: 'approved', approvedAt: new Date() } }
      );

      return Response.json({ success: true, message: 'User verification approved' });

    } 

    else if (action === 'reject') {  
  await testQNACollection.deleteOne({ _id: new ObjectId(attemptId) });
  return Response.json({ success: true, message: 'User verification rejected and attempt deleted' });
    } 
    
    else if (action === 'view') {
      const attemptData = await testQNACollection.findOne({ _id: new ObjectId(attemptId) });

      if (!attemptData) {
        return Response.json({ success: false, message: 'Attempt not found' }, { status: 404 });
      }

      return Response.json({ success: true, data: attemptData });

    } else {
      return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin update-verification error:', error);
    return Response.json(
      { success: false, message: 'Server error occurred', error: error.message },
      { status: 500 }
    );
  }
}
