import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDtAnm3bXQhmMvGPHGVz4BFn4fRR1gARV8");

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const prompt = `Generate exactly 5 concise tasks to learn about ${topic}. 
      Return ONLY the tasks separated by newlines, NO numbering, NO extra text.
      Example response:
      Install Python
      Learn basic syntax
      Practice with exercises`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the response
    const tasks = text.split('\n')
      .map(task => task.trim())
      .filter(task => task.length > 0)
      .slice(0, 5); // Ensure exactly 5 tasks

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[GEMINI_API_ERROR]", error);
    return NextResponse.json(
      { error: "API Error - Check your API key and billing" },
      { status: 500 }
    );
  }
}