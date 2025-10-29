import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const prompt = `
      You are SwapSkill Assistant — an AI helper for the SwapSkill Marketplace.
      Help users with booking, posting skills, subscriptions, or recommendations.
      Be friendly, concise, and helpful.

      User says: ${message}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to generate response" }),
      { status: 500 }
    );
  }
}
