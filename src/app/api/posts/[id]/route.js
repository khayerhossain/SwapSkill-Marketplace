// import { NextResponse } from "next/server";
// import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
// import { ObjectId } from "mongodb";

// // GET single post by ID
// export async function GET(req, { params }) {
//   try {
//     const { id } = params;
//     if (!id) return NextResponse.json({ error: "Missing post ID" }, { status: 400 });

//     const postsCollection = await dbConnect(collectionNamesObj.postsCollection);
//     const post = await postsCollection.findOne({ _id: new ObjectId(id) });

//     if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

//     return NextResponse.json(post, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return NextResponse.json({ error: "Failed to fetch post", details: error.message }, { status: 500 });
//   }
// }

// // PATCH (update single post, like/comment)
// export async function PATCH(req, { params }) {
//   try {
//     const { id } = params;
//     if (!id) return NextResponse.json({ error: "Missing post ID" }, { status: 400 });

//     const { likes, comment } = await req.json();
//     const postsCollection = await dbConnect(collectionNamesObj.postsCollection);

//     const _id = new ObjectId(id);

//     if (comment) {
//       await postsCollection.updateOne({ _id }, { $push: { comments: comment } });
//       return NextResponse.json({ success: true });
//     }

//     if (likes) {
//       await postsCollection.updateOne({ _id }, { $set: { likes } });
//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ message: "No update specified" }, { status: 400 });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     return NextResponse.json({ error: "Failed to update post", details: error.message }, { status: 500 });
//   }
// }

// // DELETE single post
// export async function DELETE(req, { params }) {
//   try {
//     const { id } = params;
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!id || !userId) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

//     const postsCollection = await dbConnect(collectionNamesObj.postsCollection);
//     const _id = new ObjectId(id);

//     const post = await postsCollection.findOne({ _id });
//     if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     if (post.user.id !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

//     await postsCollection.deleteOne({ _id });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     return NextResponse.json({ error: "Failed to delete post", details: error.message }, { status: 500 });
//   }
// }
