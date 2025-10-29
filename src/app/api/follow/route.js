
import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session?.user?._id) {
            return new Response(JSON.stringify({ success: false, message: "Not authenticated" }), { status: 401 });
        }

        const { targetUserId } = await req.json();
        if (!targetUserId) {
            return new Response(JSON.stringify({ success: false, message: "Target user ID missing" }), { status: 400 });
        }

        const db = await dbConnect();
        const follows = db.collection(collectionNamesObj.follows);

        // Check if already following
        const existing = await follows.findOne({
            followerId: session.user._id,
            followingId: targetUserId,
        });

        if (existing) {
            // Unfollow
            await follows.deleteOne({ _id: existing._id });
            return new Response(JSON.stringify({ success: true, following: false }));
        } else {
            // Follow
            await follows.insertOne({
                followerId: session.user._id,
                followingId: targetUserId,
                createdAt: new Date(),
            });
            return new Response(JSON.stringify({ success: true, following: true }));
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession();
        if (!session?.user?._id) {
            return new Response(JSON.stringify({ success: false, message: "Not authenticated" }), { status: 401 });
        }

        const db = await dbConnect();
        const follows = db.collection(collectionNamesObj.follows);

        const count = await follows.countDocuments({ followerId: session.user._id });

        return new Response(JSON.stringify({ success: true, count }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}
