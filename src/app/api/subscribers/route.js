import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function GET() {
  try {
    const subscribersCollection = await dbConnect(collectionNamesObj.newsLatterSubscribersCollection);
    const subscribers = await subscribersCollection.find({}).toArray();
    return new Response(JSON.stringify(subscribers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { email } = await req.json();
    const subscribersCollection = await dbConnect(collectionNamesObj.newsLatterSubscribersCollection);
    await subscribersCollection.deleteOne({ email });

    return new Response(JSON.stringify({ message: "Subscriber removed" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
