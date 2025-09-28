import dbConnect, { collectionNamesObj } from '@/lib/db.connect';
import { ObjectId } from 'mongodb';

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

    } else if (action === 'reject') {
      await skillsDirectoryCollection.updateOne(
        { _id: profileObjectId },
        { $set: { verification: false, status: 'pending' } }
      );

      await testQNACollection.updateOne(
        { _id: new ObjectId(attemptId) },
        { $set: { status: 'pending', rejectedAt: new Date() } }
      );

      return Response.json({ success: true, message: 'User verification rejected' });

    } else if (action === 'view') {
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
