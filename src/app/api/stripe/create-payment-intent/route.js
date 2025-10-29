import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const { piceInCents } = await req.json();
  console.log("TTTTTTTTT", piceInCents);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: piceInCents, // $10
      currency: "usd",
      payment_method_types: ["card"],
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
