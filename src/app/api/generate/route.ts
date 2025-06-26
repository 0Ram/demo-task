import { NextResponse } from "next/server";
import axios from "axios";

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `Generate exactly 5 concise tasks to learn about ${topic}.
Return ONLY the tasks separated by newlines, NO numbering, NO extra text.`;

    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: "meta-llama/Llama-3-8b-chat-hf", // You can change to another model if needed
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer a9b3460fc785a5e0d721ccac528932b5e41b9ffc457fba73dffbfc5bfe39af75`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    const tasks = reply
      .split("\n")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
      .slice(0, 5);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[TOGETHER_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}