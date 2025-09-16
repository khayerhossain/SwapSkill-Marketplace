import dbConnect, { collectionNamesObj } from "@/lib/db.connect";

export async function POST(req) {
  try {
    // user form  data
    const { email, name, image, otherData } = await req.json();

    // subscribers collection connect
    const subscribersCollection = await dbConnect(collectionNamesObj.newsLatterSubscribersCollection);

    const subscriber = {
      email,
      name: name || "",
      image: image || "",
      date: new Date(),
      otherData: otherData || ""
    };

    // database  save
    await subscribersCollection.insertOne(subscriber);

    return new Response(JSON.stringify({ message: "Subscribed successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
