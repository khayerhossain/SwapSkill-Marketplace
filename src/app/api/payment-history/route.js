import dbConnect, { collectionNamesObj } from "@/lib/db.connect";


export async function POST(req) {
  try {
    const body = await req.json();
  
    console.log(body);
    
    const paymentCollection = await dbConnect(collectionNamesObj.paymentCollection)  

    const result = await paymentCollection.insertOne(body)

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
